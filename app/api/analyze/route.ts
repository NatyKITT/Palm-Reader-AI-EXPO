import {NextRequest, NextResponse} from 'next/server';
import {generatePalmReading} from '@/lib/aiModels';
import {db} from '@/lib/firebase';
import {addDoc, collection, getDocs, query, serverTimestamp, where} from 'firebase/firestore';
import {cookies} from 'next/headers';

export const maxDuration = 60; // Vercel: max 60s pro hobby, 300s pro pro

export async function POST(request: NextRequest) {
  try {
    // imageData je nyní base64 string ("data:image/jpeg;base64,...") nebo URL (starší věštby)
    const {imageData, userName, birthDate, gender, hash} = await request.json();

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({error: 'Chybí nebo je neplatná data obrázku.'}, {status: 400});
    }

    // Odmítnout příliš velká data (ochrana před zneužitím, max ~4MB base64)
    if (imageData.length > 6_000_000) {
      return NextResponse.json({error: 'Obrázek je příliš velký. Max. 4 MB.'}, {status: 413});
    }

    // 🍪 Získání nebo vytvoření tokenu
    const cookieStore = await cookies();
    let ownerToken = cookieStore.get('user_token')?.value;
    if (!ownerToken) {
      ownerToken = crypto.randomUUID();
      cookieStore.set('user_token', ownerToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    // 🔍 Kontrola duplicity podle hashe
    if (hash) {
      const q = query(
        collection(db, 'readings'),
        where('hash', '==', hash),
        where('ownerToken', '==', ownerToken)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        return NextResponse.json({
          reading: existingDoc.data().reading,
          id: existingDoc.id,
          isError: false,
        });
      }
    }

    // 🔮 Generování věštby (imageData = base64 nebo URL)
    const {reading, isError} = await generatePalmReading(imageData, userName, birthDate, gender, hash);

    if (isError) {
      return NextResponse.json({reading, isError: true});
    }

    // 💾 Uložit do Firestore – BEZ imageData (nechceme ukládat velké base64)
    // Místo toho ukládáme placeholder, aby galerie věděla, že věštba existuje
    const docRef = await addDoc(collection(db, 'readings'), {
      imageUrl: null, // obrázek se neukládá
      reading,
      name: userName || null,
      birthdate: birthDate || null,
      gender: gender || null,
      hash: hash || null,
      createdAt: serverTimestamp(),
      ownerToken,
    });

    return NextResponse.json({reading, id: docRef.id, isError: false});
  } catch (error: any) {
    console.error('Chyba v /api/analyze:', error);
    return NextResponse.json({
      error: 'Interni chyba serveru',
      details: error?.message || 'Neznama chyba',
    }, {status: 500});
  }
}

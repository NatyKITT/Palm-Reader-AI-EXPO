import {addDoc, collection, getDocs, query, serverTimestamp, where} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {getCookie, setCookie} from 'cookies-next';
import {v4 as uuidv4} from 'uuid';

// Poznámka: imageUrl parametr byl odstraněn – obrázky se již neukládají do Firebase Storage.
// Věštby se ukládají pouze jako text do Firestore.

export async function saveReadingClient(
  reading: string,
  name?: string,
  birthdate?: string,
  gender?: string,
  hash?: string
): Promise<string | null> {
  try {
    let token = getCookie('user_token') as string | undefined;
    if (!token) {
      token = uuidv4();
      setCookie('user_token', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    const maxLength = 10000;
    const trimmedReading = reading.length > maxLength
      ? reading.slice(0, maxLength) + ' [...]'
      : reading;

    // Zkontroluj duplicitu
    if (hash) {
      const q = query(
        collection(db, 'readings'),
        where('hash', '==', hash),
        where('ownerToken', '==', token)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].id;
      }
    }

    const docRef = await addDoc(collection(db, 'readings'), {
      reading: trimmedReading,
      imageUrl: null,
      name: name || null,
      birthdate: birthdate || null,
      gender: gender || null,
      hash: hash || null,
      ownerToken: token,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Chyba při ukládání věštby:', error);
    return null;
  }
}

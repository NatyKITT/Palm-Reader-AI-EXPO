import OpenAI from "openai";
import {db} from "@/lib/firebase";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Přijímá imageData: buď "data:image/jpeg;base64,..." (nový způsob)
 * nebo "https://..." (zpětná kompatibilita pro starší věštby)
 */
export async function generatePalmReading(
  imageData: string,
  userName?: string,
  birthDate?: string,
  gender?: string,
  hash?: string
): Promise<{reading: string; isError: boolean}> {
  try {
    // 🔎 Cache: pokud věštba pro tento hash existuje, vrátit ji
    if (hash) {
      const existingDoc = await getDoc(doc(db, "readingsByHash", hash));
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        if (data.reading) {
          return {reading: data.reading, isError: false};
        }
      }
    }

    // 📸 Sestavení image content – base64 nebo URL
    const isBase64 = imageData.startsWith("data:");
    const imageContent: OpenAI.ChatCompletionContentPartImage = isBase64
      ? {
          type: "image_url",
          image_url: {url: imageData, detail: "low"},
        }
      : {
          type: "image_url",
          image_url: {url: imageData},
        };

    // 🔍 Popis dlaně přes Vision API
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Jsi vizualni asistent. Popis v cestine, co vidi na obrazku. Zamer se na cary dlane, prsty a vnitrni stranu ruky.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Popis, co vidi na tomto obrazku. Zamer se na cary dlane a prstu, jejich tvar, delku a rozdeleni. Je na nem lidska dlan?",
            },
            imageContent,
          ],
        },
      ],
      max_tokens: 400,
    });

    const description = visionResponse.choices[0]?.message?.content?.toLowerCase() ?? "";
    const positiveWords = ["dlan", "prsty", "cary", "vnitrni strana ruky", "linie zivota", "palm", "finger", "hand"];
    const positiveMatches = positiveWords.filter(word => description.includes(word));
    const negativeWords = ["oblicej", "hlava", "cela postava", "telo", "rameno", "loket", "noha", "zada", "graf", "tabulka", "diagram", "text", "napis", "obrazovka", "monitor"];
    const containsNegative = negativeWords.some(word => description.includes(word));

    if (positiveMatches.length < 1 || containsNegative) {
      return {
        reading: "⚠️ Nepodarilo se rozpoznat jasnou otevrenu dlan. Nahraj prosim zretelnou fotografii cele vnitrni strany ruky (dlane)🖐️. Vyhni se obrazkum obsahujicim grafy, text nebo jine casti tela.",
        isError: true,
      };
    }

    const prompt = `
    Jsi zkusena ceska chiromantka s letitou praxi. Pomocí popisu dlane vykladás budoucnost a osobnost cloveka s vyuzitim car na dlani, astrologickych znameni a zakladnich udaju (jmeno, vek, pohlavi). 
    **Neukoncuj text podpisem, nepis "s laskou", "tvoje vestkyně" ani zadne jine zakonceni. Vyklad ma skoncit posledni vetou samotneho obsahu.**
    Vyklad by mel byt:
    - prirozeny, lidsky, empaticky
    - pozitivni, ale ne prilis ezotericky
    - pokud je uvedeno jmeno a pohlavi: oslov napr. "Mila Pavlo", "Mily Petre"
    - pokud je jen jmeno bez pohlavi: oslov neutralne
    - pokud neni uvedeno jmeno ani pohlavi: nepoužívej osobni osloveni
    - soustredenej na 4 cary: zivota, srdce, hlavy, osudu
    - muze obsahovat lehce konkretni doporuceni

    Tady je popis osoby:
    ${userName ? `Jmeno: ${userName}.` : ""}
    ${gender ? `Pohlavi: ${gender}.` : ""}
    ${birthDate ? `Datum narozeni: ${birthDate}.` : ""}
    Popis ruky: ${description}

    Napis osobni vyklad ve 3-5 odstavcich.
  `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: "Odpovídej jako laskava ceska vestkyně."},
        {role: "user", content: prompt},
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const finalReading = completion.choices[0]?.message?.content?.trim() || "🧿 Nepodarilo se vygenerovat vestbu.";

    // 💾 Uložit výsledek pod hash (bez imageData – šetříme Firestore)
    if (hash) {
      await setDoc(doc(db, "readingsByHash", hash), {
        reading: finalReading,
        userName: userName || null,
        birthDate: birthDate || null,
        gender: gender || null,
        createdAt: serverTimestamp(),
      });
    }

    return {reading: finalReading, isError: false};
  } catch (error) {
    console.error("Chyba pri generovani vestby:", error);
    return {
      reading: "⚠️ Omlouvam se, doslo k technicke chybe. Zkuste to prosim pozdeji.",
      isError: true,
    };
  }
}

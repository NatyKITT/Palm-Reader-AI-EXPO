import OpenAI from "openai";
import {getChineseZodiac, getWesternZodiac} from '@/lib/astrology';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const westernSignTraits: Record<string, string> = {
  'Beran':    'průkopník, lídr, iniciativní, nebojí se výzev',
  'Býk':      'spolehlivý, vytrvalý, praktický, smysl pro detail',
  'Blíženci': 'komunikativní, všestranný, rychle se učí, adaptabilní',
  'Rak':      'empatický, pečující, loajální, silná intuice',
  'Lev':      'charismatický, sebevědomý, přirozený lídr, kreativní',
  'Panna':    'analytická, pečlivá, systematická, spolehlivá',
  'Váhy':     'diplomatický, spravedlivý, týmový hráč, smysl pro harmonii',
  'Štír':     'intuitivní, hloubavý, odhodlaný, strategický myslitel',
  'Střelec':  'optimistický, svobodomyslný, vizionář, rád se vzdělává',
  'Kozoroh':  'ambiciózní, disciplinovaný, trpělivý, dlouhodobé myšlení',
  'Vodnář':   'originální, nezávislý, inovativní, přemýšlí dopředu',
  'Ryby':     'citlivý, intuitivní, kreativní, empatie k druhým',
};

const westernSignElement: Record<string, string> = {
  'Beran': 'Oheň', 'Lev': 'Oheň', 'Střelec': 'Oheň',
  'Býk': 'Země', 'Panna': 'Země', 'Kozoroh': 'Země',
  'Blíženci': 'Vzduch', 'Váhy': 'Vzduch', 'Vodnář': 'Vzduch',
  'Rak': 'Voda', 'Štír': 'Voda', 'Ryby': 'Voda',
};

const elementDescription: Record<string, string> = {
  'Oheň':   'živelná energie, přirozené vůdčí schopnosti, nadšení které strhává ostatní, iniciativa a odvaha pustit se do nového',
  'Země':   'spolehlivost a vytrvalost, smysl pro systém a detail, praktické myšlení, schopnost dotahovat věci do konce',
  'Vzduch': 'analytické myšlení, komunikační talent, rychlé učení, schopnost budovat vztahy a sítě, přinášení nových nápadů',
  'Voda':   'hluboká empatie a intuice, schopnost číst lidi a situace, silné mezilidské vztahy, citlivost na prostředí a atmosféru',
};

export async function generatePalmReading(
    imageData: string,
    userName?: string,
    birthDate?: string,
    gender?: string,
): Promise<{ reading: string; isError: boolean }> {
  try {
    let astroContext = "";
    if (birthDate) {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const age = new Date().getFullYear() - year;

      const chinese = getChineseZodiac(year);
      const western = getWesternZodiac(month, day);
      const traits = westernSignTraits[western.sign] ?? "";
      const element = westernSignElement[western.sign] ?? "";
      const elementDesc = elementDescription[element] ?? "";

      astroContext = `
ASTROLOGICKÝ PROFIL:
- Věk: ~${age} let
- Životní fáze: ${age < 25 ? "start kariéry, první velká rozhodnutí" : age < 35 ? "budování kariéry, hledání zázemí" : age < 50 ? "zkušený profesionál, čas na posun nebo změnu" : "bohaté zkušenosti, mentorská role"}
- Západní znamení: ${western.emoji} ${western.sign} | Živel: ${element} – ${elementDesc}
- Vlastnosti: ${traits}
- Čínský horoskop: ${chinese.emoji} ${chinese.sign}
Propoj živel + čínské znamení + čáry dlaně do jednoho konzistentního obrazu osobnosti.`;
    }

    const genderContext = gender === "žena"
        ? "Věštbu piš ženě – používej ženský rod důsledně."
        : gender === "muž"
            ? "Věštbu piš muži – používej mužský rod důsledně."
            : "Pohlaví není zadáno – piš důsledně neutrálně bez určení rodu.";

    const dataContext = (() => {
      const available: string[] = [];
      const missing: string[] = [];
      if (userName) available.push(`jméno: "${userName}"`);
      else missing.push("jméno");
      if (birthDate) available.push("datum narození + astrologický profil");
      else missing.push("datum narození – astrologický kontext VYNECH");
      if (gender) available.push(`pohlaví: ${gender}`);
      else missing.push("pohlaví – piš neutrálně");
      if (available.length === 0) {
        return "Žádné osobní údaje nejsou zadány. Věštbu zakládej POUZE na čarách dlaně. Odhadni typ osobnosti z dlaně a piš konkrétně.";
      }
      return `K dispozici: ${available.join(", ")}. Chybí: ${missing.join(", ")}.`;
    })();

    const salutation = userName
        ? gender === "žena" ? `Milá ${userName},`
            : gender === "muž" ? `Milý ${userName},`
                : `${userName},`
        : gender === "žena" ? `Milá návštěvnice,`
            : gender === "muž" ? `Milý návštěvníku,`
                : `Vítej,`;

    const systemPrompt = `Jsi zkušená česká chiromantka s 30 lety praxe na kariérním veletrhu Career Expo Úřadu městské části Praha 6.

PRÁCE S OBRÁZKEM:
Obrázek je fotografie ruky nebo dlaně pořízená návštěvníkem veletrhu. Fotografie může být nekvalitní, rozmazaná, tmavá nebo částečná – to je normální a nevadí. Vždy napiš věštbu na základě toho co vidíš nebo co odhadneš. Pokud jsou čáry špatně viditelné, odhadni je z kontextu a tvaru ruky.
ABSOLUTNÍ ZÁKAZ:
Nikdy nezačínaj větou nebo odstavcem kde vysvětluješ že nemůžeš přečíst dlaň nebo že vytváříš obecnou věštbu. Nikdy nepoužívej oddělovač "---". Vždy rovnou začni oslovením a věštbou jako by sis dlaň přečetla perfektně.

${genderContext}
DOSTUPNÉ ÚDAJE: ${dataContext}
${astroContext}

OSLOVENÍ: Začni přesně takto: "${salutation}"

STRUKTURA – 5 odstavců, 420–500 slov:

── ODSTAVEC 1: OSOBNOST Z DLANĚ${birthDate ? " + ŽIVEL + HOROSKOP" : ""}
Přečti konkrétní rysy z dlaně:
- Čára hlavy: přímá a dlouhá = systematický logik, analytik; prohnutá dolů = kreativní vizionář, intuitivní typ; krátká = rozhodný člověk činu
- Čára života: hluboká = silná energie a spolehlivost; jemná nebo větvená = citlivost a adaptabilita
- Prsty pokud viditelné: dlouhé = preciznost; kratší = praktičnost
${birthDate ? "Propoj s živlem a čínským horoskopem do jednoho konkrétního obrazu." : "Odhadni typ z dlaně a buď konkrétní."}
Naznač: právě tyto vlastnosti jsou to co Praha 6 hledá – moderní úřad potřebuje analytiky i kreativce, spolehlivé opory i inovátory.

── ODSTAVEC 2: CITOVÝ SVĚT, VZTAHY A KOLEKTIV NA PRAZE 6
Čára srdce: hluboká a dlouhá = vášnivý oddaný typ; krátká = praktický přístup; větvení = dar pro hluboké vztahy.
${birthDate ? "Propoj s živlem – Oheň prožívá vášnivě, Země hledá jistotu, Vzduch potřebuje svobodu, Voda cítí hluboko." : "Odhadni emocionální typ z čar."}
Propoj s pracovním prostředím Prahy 6 – přátelský kolektiv kde se ke všem přistupuje lidsky a férově. Naznač konkrétní předpověď – nové přátelství nebo setkání možná právě v novém pracovním prostředí.

── ODSTAVEC 3: ŽIVOTNÍ CESTA, BUDOUCNOST A ŠESTÝ OBVOD
Čára osudu a čára života ukazují směřování. Větu jako "tvá čára osudu se stáčí k šestému obvodu" zakomponuj přirozeně.
${birthDate ? "Propoj s čínským horoskopem – charakter zvířete naznačuje timing nebo typ změny." : "Na základě čar naznač konkrétní příležitost."}
Zmiň prostředí: moderní úřad v Dejvicích a Bubenči – ráno kolo přes Stromovku nebo procházka podél Bubenečského potoka, oběd v kavárně v historické vile, kosmopolitní atmosféra ambasád a sousedství světových univerzit, metro A a letiště za 15 minut.

── ODSTAVEC 4: KARIÉRA NA PRAZE 6 – SRDCE VĚŠTBY
Propoj silné stránky z dlaně${birthDate ? ", živlu a horoskopu" : ""} s konkrétní kariérou. Musí znít jako nevyhnutelné setkání.

Vyber 1–2 role dle osobnosti – POKAŽDÉ JINOU KOMBINACI:
Skupina A (logik, analytik): finanční controlling | rozpočet a účetnictví | IT specialista | digitalizace úřadu | právní specialista | legislativa | veřejné zakázky
Skupina B (kreativec, komunikátor): PR a tiskový mluvčí | komunikace s občany | správa sociálních sítí | koordinátor kultury | správa sportovišť | komunitní koordinátor | terénní sociální práce
Skupina C (organizátor, lídr): projektový manažer | vedoucí odboru | koordinátor investic | správa majetku města | bezpečnostní koordinátor
Skupina D (pečující, HR typ): HR specialista | vzdělávání zaměstnanců | sociální kurátor | koordinátor Sluníčko | rodinné centrum
Skupina E (vizionář, inovátor): smart city specialista | koordinátor udržitelnosti | správa zeleně | územní plánování | architekt veřejného prostoru

Praha 6 = moderní organizace, 120 000 obyvatel, smysluplná práce, stabilní plat, férovost.
Vepleť 2–3 benefity přirozeně – POKAŽDÉ JINOU KOMBINACI:
pružná pracovní doba a home office | 5 týdnů dovolené | 3 sick days | 2 dny volna | e-stravenky | MHD kupon | eBenefit 1 000 Kč/měsíc | penzijní připojištění | vzdělávání | dětská skupina Sluníčko | zkrácené úvazky

── ODSTAVEC 5: ZÁVĚREČNÉ POVZBUZENÍ
Osobní povzbuzení navazující na předchozí. Poslední věta MUSÍ být jedna z (pokaždé jinou):
"Tvůj další kariérní posun najdeš na www.kariera6.cz"
"Svoji budoucí kariéru najdeš na www.kariera6.cz"
"Hvězdy i čáry tvé dlaně ukazují jasně – více na www.kariera6.cz"
"Šestý obvod tě čeká – začni na www.kariera6.cz"
"Tvůj osud a Praha 6 mají mnoho společného – přesvědč se na www.kariera6.cz"

VARIABILITA: Jiný tón pokaždé, jiné role, jiné benefity, jiná předpověď. Nikdy nepodpisuj.`;

    const userText = `Toto je fotografie ruky návštěvníka veletrhu Career Expo pro chiromantický výklad. Přečti dlaň a napiš věštbu.${
        userName ? ` Jméno: ${userName}.` : " Jméno není zadáno."
    }${
        gender ? ` Pohlaví: ${gender}.` : " Pohlaví není zadáno – piš neutrálně."
    }${
        birthDate ? ` Datum narození: ${birthDate}.` : " Datum není zadáno – věštbu zakládej jen na čarách."
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: systemPrompt},
        {
          role: "user",
          content: [
            {type: "text", text: userText},
            {type: "image_url", image_url: {url: imageData, detail: "high"}},
          ],
        },
      ],
      temperature: 0.95,
      max_tokens: 1300,
    });

    const result = completion.choices[0]?.message?.content?.trim() ?? "";

    if (result === "" || result.toUpperCase().includes("ODMÍTNUTO") || result.toUpperCase().includes("I'M UNABLE") || result.toUpperCase().includes("I AM UNABLE") || result.toUpperCase().includes("I CANNOT") || result.toUpperCase().includes("I'M SORRY") || result.toUpperCase().includes("OMLOUVÁM SE") || result.toUpperCase().includes("GENERAL READING") || result.includes("---")) {
      const fallback = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Jsi zkušená česká chiromantka na Career Expo MČ Praha 6. Napiš osobní věštbu z dlaně pro návštěvníka veletrhu. Věštbu vymysli kreativně a osobně.${
                userName ? ` Jméno: ${userName}.` : ""
            }${
                gender ? ` Pohlaví: ${gender}.` : ""
            }${
                birthDate ? ` Datum narození: ${birthDate}.` : ""
            }${astroContext}

Oslovení: "${salutation}"
${genderContext}

Napiš věštbu v 5 odstavcích, 420–500 slov. Praha 6 musí být přirozeně v každém odstavci. Zmiň konkrétní roli dle osobnosti a 2–3 benefity. Poslední věta: "Šestý obvod tě čeká – začni na www.kariera6.cz". Nikdy nepodpisuj.`,
          },
        ],
        temperature: 0.95,
        max_tokens: 1300,
      });

      const fallbackResult = fallback.choices[0]?.message?.content?.trim() ?? "";
      return {
        reading: fallbackResult || "⚠️ Zkuste to prosím znovu.",
        isError: fallbackResult === "",
      };
    }

    return {reading: result, isError: false};

  } catch (error: any) {
    console.error("Chyba při generování věštby:", error?.message ?? error);
    return {
      reading: "⚠️ Omlouvám se, došlo k technické chybě. Zkuste to prosím za chvíli.",
      isError: true,
    };
  }
}

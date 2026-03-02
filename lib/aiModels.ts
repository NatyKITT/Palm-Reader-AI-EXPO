import OpenAI from "openai";
import { getChineseZodiac, getWesternZodiac } from "@/lib/astrology";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const westernSignTraits: Record<string, string> = {
  Beran: "průkopník, lídr, iniciativní, nebojí se výzev",
  Býk: "spolehlivý, vytrvalý, praktický, smysl pro detail",
  Blíženci: "komunikativní, všestranný, rychle se učí, adaptabilní",
  Rak: "empatický, pečující, loajální, silná intuice",
  Lev: "charismatický, sebevědomý, přirozený lídr, kreativní",
  Panna: "analytická, pečlivá, systematická, spolehlivá",
  Váhy: "diplomatický, spravedlivý, týmový hráč, smysl pro harmonii",
  Štír: "intuitivní, hloubavý, odhodlaný, strategický myslitel",
  Střelec: "optimistický, svobodomyslný, vizionář, rád se vzdělává",
  Kozoroh: "ambiciózní, disciplinovaný, trpělivý, dlouhodobé myšlení",
  Vodnář: "originální, nezávislý, inovativní, přemýšlí dopředu",
  Ryby: "citlivý, intuitivní, kreativní, empatie k druhým",
};

const westernSignElement: Record<string, string> = {
  Beran: "Oheň", Lev: "Oheň", Střelec: "Oheň",
  Býk: "Země", Panna: "Země", Kozoroh: "Země",
  Blíženci: "Vzduch", Váhy: "Vzduch", Vodnář: "Vzduch",
  Rak: "Voda", Štír: "Voda", Ryby: "Voda",
};

const elementDescription: Record<string, string> = {
  Oheň: "živelná energie, přirozené vůdčí schopnosti, nadšení které strhává ostatní, iniciativa a odvaha pustit se do nového",
  Země: "spolehlivost a vytrvalost, smysl pro systém a detail, praktické myšlení, schopnost dotahovat věci do konce",
  Vzduch: "analytické myšlení, komunikační talent, rychlé učení, schopnost budovat vztahy a sítě, přinášení nových nápadů",
  Voda: "hluboká empatie a intuice, schopnost číst lidi a situace, silné mezilidské vztahy, citlivost na prostředí a atmosféru",
};

type CareerTrack = "IT_KITT6" | "URAD" | "PEOPLE" | "PROJECTS" | "COMMS" | "URBANISM";

type RoleOption = {
  label: string;
  track: CareerTrack;
  minAge?: number;
  maxAge?: number;
};

function computeAge(birthDate: string): number | undefined {
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function getVariantSeed(): string {
  const uuid = (globalThis as any)?.crypto?.randomUUID?.();
  return (uuid ?? `${Date.now()}-${Math.random()}`)
      .toString()
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);
}

function mulberry32(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function rnd() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function pickManyUnique<T>(arr: T[], count: number, rnd: () => number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < count) {
    const idx = Math.floor(rnd() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function ageBand(age?: number) {
  if (age == null || Number.isNaN(age)) {
    return { band: "nezadaný", seniority: "neutrálně", focus: "obecně", phase: "věk není zadán – napiš univerzálně, ale stále konkrétně; z dlaně odhadni tempo růstu a míru zodpovědnosti" };
  }
  if (age < 23) return { band: "junior/start", seniority: "juniorní", focus: "učení, rotace, mentor", phase: "start kariéry, první velká rozhodnutí" };
  if (age < 30) return { band: "junior–medior", seniority: "juniorní až mediorní", focus: "specializace, tempo růstu", phase: "budování kariéry, hledání zázemí" };
  if (age < 40) return { band: "medior–senior", seniority: "mediorní až seniorní", focus: "odpovědnost, vedení menších věcí", phase: "zkušený profesionál, posun nebo změna" };
  if (age < 55) return { band: "senior/lead", seniority: "seniorní až lead", focus: "strategie, vedení lidí/projektů", phase: "hlubší dopad, vedení, stabilizace procesů" };
  return { band: "expert/mentor", seniority: "expertní", focus: "mentoring, stabilizace, předávání know-how", phase: "bohaté zkušenosti, mentorská role" };
}

const ROLE_POOL: RoleOption[] = [
  { label: "IT projektový manažer (digitální služby pro občany)", track: "IT_KITT6", minAge: 24 },
  { label: "IT service manager / koordinátor IT podpory (SLA, procesy)", track: "IT_KITT6", minAge: 25 },
  { label: "specialista kyberbezpečnosti (řízení rizik, bezpečnostní politika)", track: "IT_KITT6", minAge: 26 },
  { label: "správce M365 a identit (přístupy, bezpečnost, governance)", track: "IT_KITT6", minAge: 23 },
  { label: "aplikáční správce / owner agendových systémů", track: "IT_KITT6", minAge: 23 },
  { label: "data/BI analytik pro rozhodování městské části", track: "IT_KITT6", minAge: 22 },
  { label: "specialista digitalizace procesů (workflow, automatizace)", track: "IT_KITT6", minAge: 23 },
  { label: "koordinátor dodavatelů IT a licencí", track: "IT_KITT6", minAge: 24 },
  { label: "junior IT technik / helpdesk specialista", track: "IT_KITT6", minAge: 18, maxAge: 28 },
  { label: "správce síťové infrastruktury a serverů", track: "IT_KITT6", minAge: 23 },

  { label: "specialista veřejných zakázek", track: "URAD", minAge: 23 },
  { label: "finanční controlling / rozpočtář", track: "URAD", minAge: 23 },
  { label: "právní specialista (legislativa, smlouvy, správní agenda)", track: "URAD", minAge: 25 },
  { label: "správce smluv a evidence (přesnost, pořádek, termíny)", track: "URAD", minAge: 21 },
  { label: "referent správních agend a životních situací", track: "URAD", minAge: 20 },
  { label: "specialista dotací a fondů EU", track: "URAD", minAge: 24 },
  { label: "analytik dat a reporting pro vedení radnice", track: "URAD", minAge: 23 },

  { label: "projektový manažer (koordinace týmů a dodavatelů)", track: "PROJECTS", minAge: 24 },
  { label: "koordinátor investic a správy majetku", track: "PROJECTS", minAge: 27 },
  { label: "bezpečnostní koordinátor (procesy, připravenost, spolupráce)", track: "PROJECTS", minAge: 27 },
  { label: "koordinátor provozu budov a služeb (organizace, odpovědnost)", track: "PROJECTS", minAge: 24 },
  { label: "facility manažer (správa budov a technického zázemí)", track: "PROJECTS", minAge: 25 },
  { label: "koordinátor krizového řízení a continuity", track: "PROJECTS", minAge: 28 },

  { label: "specialista komunikace s občany (srozumitelnost, web, obsah)", track: "COMMS", minAge: 20 },
  { label: "správce sociálních sítí / community manager", track: "COMMS", minAge: 18 },
  { label: "koordinátor kultury a komunitních akcí", track: "COMMS", minAge: 20 },
  { label: "PR specialista / tisková podpora (věcnost, klid, styl)", track: "COMMS", minAge: 22 },
  { label: "redaktor / editor obsahu pro web a zpravodaj", track: "COMMS", minAge: 20 },
  { label: "koordinátor sportu, mládeže a volného času", track: "COMMS", minAge: 22 },
  { label: "grafik / vizuální komunikátor (print i digitál)", track: "COMMS", minAge: 20 },

  { label: "HR specialista (nábor, adaptace, vzdělávání)", track: "PEOPLE", minAge: 22 },
  { label: "specialista vzdělávání zaměstnanců (plány, koordinace, péče)", track: "PEOPLE", minAge: 22 },
  { label: "sociální kurátor / terénní práce", track: "PEOPLE", minAge: 22 },
  { label: "koordinátor rodinných služeb (návazné služby pro rodiče)", track: "PEOPLE", minAge: 22 },
  { label: "koordinátor seniorských programů a aktivního stárnutí", track: "PEOPLE", minAge: 24 },
  { label: "pracovník sociální prevence a komunitní práce", track: "PEOPLE", minAge: 22 },
  { label: "metodik péče o zaměstnance a wellbeing", track: "PEOPLE", minAge: 25 },

  { label: "smart city koordinátor (projekty, data, městské inovace)", track: "URBANISM", minAge: 24 },
  { label: "koordinátor udržitelnosti a projektů pro veřejný prostor", track: "URBANISM", minAge: 24 },
  { label: "specialista správy zeleně a plánování (datově i terénně)", track: "URBANISM", minAge: 22 },
  { label: "koordinátor dopravy a mobility (procesy, komunikace, dopad)", track: "URBANISM", minAge: 24 },
  { label: "urbanista / specialista územního rozvoje", track: "URBANISM", minAge: 25 },
  { label: "koordinátor klimatické adaptace a energetiky budov", track: "URBANISM", minAge: 24 },
  { label: "správce dat GIS a mapových podkladů", track: "URBANISM", minAge: 22 },
];

const BENEFIT_POOL: string[] = [
  "pružná pracovní doba a možnost home office",
  "5 týdnů dovolené",
  "3 sick days",
  "e-stravenky",
  "příspěvek na MHD / dopravu",
  "eBenefit 1 000 Kč/měsíc",
  "penzijní připojištění",
  "vzdělávání a certifikace",
  "zkrácené úvazky (dle role)",
  "zázemí pro rodiče (např. dětská skupina Sluníčko)",
  "2 dny volna na osobní záležitosti",
  "stabilní plat s transparentními tabulkami",
];

const LOCAL_FLAVOR_POOL: string[] = [
  "Dejvice a Bubeneč s kosmopolitní atmosférou, univerzitami a ambasádami",
  "Stromovka nebo Ladronka jako přirozený reset mezi úkoly, cesta do práce na kole",
  "metro A a letiště za rohem – logistika bez stresu",
  "Břevnov a Střešovice – klidné čtvrti s vlastním rytmem",
  "tiché ulice Ořechovky kde se dá skutečně soustředit a zrelaxovat procházkou",
  "rychlé spojení na Veleslavín, Petřiny a Hradčanskou – dojíždění metrem, tramvají nebo vlakové spojení",
  "procházka podél Bubenečského potoka jako přirozený začátek dne",
  "oběd v historické vile nebo káva v moderní budově – Praha 6 umí být krásná",
  "sousedství ČVUT, UK a VŠCHT – vzdělání a inovace na dosah",
  "Divoká Šárka kousek za rohem pro ranní běh nebo odpolední reset",
];

const TONE_POOL: string[] = [
  "věcný, uklidňující a sebejistý – jako zkušená průvodkyně",
  "energický a motivační – jako někdo kdo věří v potenciál",
  "jemně poetický ale konkrétní – obrazy z dlaně i ze života",
  "hravý a lidský – s lehkostí a bez kýče",
  "vřelý a osobní – jako rozhovor mezi čtyřma očima",
];

const CAREER_FRAMING_POOL: string[] = [
  "tvoje schopnosti by našly přirozený prostor v",
  "čáry dlaně naznačují, že tvůj talent patří do prostředí jako je",
  "vidím jasnou spojnici mezi tím kdo jsi a tím co nabízí",
  "tvoje energie a způsob uvažování sedí přesně do",
  "není náhoda, že tě osud přivedl na tuto akci –",
];

const KITT6_FRAMING_POOL: string[] = [
  "KITT6 – příspěvková organizace Prahy 6 která stojí za vším IT a technickým zázemím úřadu",
  "KITT6, která zajišťuje SW, HW a IT podporu celé radnice a jejích agend",
  "KITT6 – tým technologů a správců systémů kteří drží digitální páteř Prahy 6",
  "KITT6, příspěvkovou organizaci která digitalizuje a udržuje v chodu IT infrastrukturu městské části",
];

export async function generatePalmReading(
    imageData: string,
    userName?: string,
    birthDate?: string,
    gender?: string
): Promise<{ reading: string; isError: boolean }> {
  try {
    const genderContext =
        gender === "žena" ? "Věštbu piš ženě – používej ženský rod důsledně."
            : gender === "muž" ? "Věštbu piš muži – používej mužský rod důsledně."
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

    let astroContext = "";
    let age: number | undefined = undefined;
    let element = "";
    let westernSign: { sign: string; emoji?: string } | null = null;
    let chinese: { sign: string; emoji?: string } | null = null;
    let traits = "";
    let elementDesc = "";

    if (birthDate) {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      age = computeAge(birthDate);

      chinese = getChineseZodiac(year);
      const western = getWesternZodiac(month, day);
      westernSign = { sign: western.sign, emoji: western.emoji };

      traits = westernSignTraits[western.sign] ?? "";
      element = westernSignElement[western.sign] ?? "";
      elementDesc = elementDescription[element] ?? "";

      const band = ageBand(age);

      astroContext = `
ASTROLOGICKÝ PROFIL:
- Věk: ~${age ?? "?"} let
- Životní fáze: ${band.phase}
- Západní znamení: ${westernSign.emoji} ${westernSign.sign} | Živel: ${element} – ${elementDesc}
- Vlastnosti ${westernSign.sign}: ${traits}
- Čínský horoskop: ${chinese.emoji} ${chinese.sign}
- Kombinace ${westernSign.emoji} ${westernSign.sign} + ${chinese.emoji} ${chinese.sign}: tato kombinace je vzácná a říká mnoho o způsobu jak člověk přistupuje k práci a lidem – zakomponuj ji do věštby jako jedinečný rys osobnosti.
Propoj živel ${element} + ${westernSign.sign} + ${chinese.sign} + čáry dlaně do jednoho konzistentního a osobního obrazu.`;
    }

    const variantSeed = getVariantSeed();
    const rnd = mulberry32(variantSeed);
    const band = ageBand(age);

    const preferredTracks: CareerTrack[] =
        element === "Země" ? ["URAD", "PROJECTS", "IT_KITT6"]
            : element === "Vzduch" ? ["COMMS", "URBANISM", "IT_KITT6"]
                : element === "Oheň" ? ["PROJECTS", "COMMS", "URAD"]
                    : element === "Voda" ? ["PEOPLE", "COMMS", "URAD"]
                        : ["URAD", "PROJECTS", "COMMS", "PEOPLE", "URBANISM", "IT_KITT6"];

    const eligibleRoles = ROLE_POOL.filter((r) => {
      if (age == null) return true;
      if (r.minAge != null && age < r.minAge) return false;
      if (r.maxAge != null && age > r.maxAge) return false;
      return true;
    });

    const preferredRoles = eligibleRoles.filter((r) => preferredTracks.includes(r.track));
    const pickedPreferred = pickManyUnique(preferredRoles, 3, rnd);
    const remainingEligible = eligibleRoles.filter((r) => !pickedPreferred.includes(r));
    const pickedRest = pickManyUnique(remainingEligible, 3, rnd);
    const rolePack = [...pickedPreferred, ...pickedRest].slice(0, 6);
    const benefitPack = pickManyUnique(BENEFIT_POOL, 3, rnd);
    const localPack = pickManyUnique(LOCAL_FLAVOR_POOL, 3, rnd);
    const tone = pickOne(TONE_POOL, rnd);
    const careerFraming = pickOne(CAREER_FRAMING_POOL, rnd);
    const kitt6Framing = pickOne(KITT6_FRAMING_POOL, rnd);

    const rolePackText = rolePack.map((r) => `- ${r.label} [${r.track}]`).join("\n");
    const benefitPackText = benefitPack.map((b) => `- ${b}`).join("\n");
    const localPackText = localPack.map((l) => `- ${l}`).join("\n");

    const systemPrompt = `Jsi zkušená česká chiromantka s 30 lety praxe, hostující na kariérní akci městské části Praha 6 (nejsi zaměstnankyně úřadu).

PRÁCE S OBRÁZKEM:
Obrázek je fotografie ruky nebo dlaně. Může být nekvalitní, rozmazaná, tmavá nebo částečná – nevadí. Věštbu vždy napiš. Pokud jsou čáry špatně viditelné, odhadni je z kontextu a tvaru ruky. Nikdy se neomluvuj za kvalitu fotky.

ABSOLUTNÍ ZÁKAZY:
- Nikdy nezačínaj omluvami: „nejde přečíst", „nemohu", „jen obecně", „I'm sorry", „I cannot". Vždy rovnou oslovení a věštba.
- Nikdy nepoužívej oddělovač "---".
- Nikdy nepiš „pracuješ na úřadě" nebo „u nás". Kariéru vždy rámuj z pohledu návštěvníka: jak by se jeho schopnosti uplatnily.
- Nepiš interní tagy v hranatých závorkách [IT_KITT6] do výstupu.

${genderContext}
DOSTUPNÉ ÚDAJE: ${dataContext}
${astroContext}

VARIANTA: seed=${variantSeed}
TÓN: ${tone}
KARIÉRNÍ VAZBA: použij formulaci jako „${careerFraming}" (nebo podobnou – nemusí být doslovně)
KITT6 FORMULACE: pokud je relevantní IT, použij: „${kitt6Framing}"

VĚKOVÁ SENIORITA: ${band.seniority} | SMĚR: ${band.focus}

ROLE-PACK (vyber přesně 2 a POUZE z tohoto seznamu – nesmíš vymýšlet jiné):
${rolePackText}

BENEFITY-PACK (použij 3 až 4 a POUZE z tohoto seznamu):
${benefitPackText}

LOKÁLNÍ DETAILY (použij aspoň 2 až 3 přirozeně v textu):
${localPackText}

PRAVIDLO PRO IT: Pokud je vybraná role z tracku IT_KITT6, VŽDY zmiň KITT6 pomocí výše uvedené formulace.

OSLOVENÍ: Začni přesně: "${salutation}"

STRUKTURA – 5 odstavců, celkem 420–500 slov:
- Odstavce 1–3: každý 60–85 slov
- Odstavec 4 (kariéra): 170–220 slov (nejdelší, nejkonkrétnější)
- Odstavec 5: 50–80 slov

── ODSTAVEC 1: OSOBNOST Z DLANĚ${birthDate ? " + ŽIVEL + HOROSKOP" : ""}
Konkrétní rysy z dlaně. Čára hlavy: přímá = logik/analytik; prohnutá = kreativec/vizionář; krátká = člověk činu. Čára života: hluboká = energie; větvená = adaptabilita. Prsty: dlouhé = preciznost; kratší = praktičnost.
${birthDate && westernSign ? `Propoj s ${westernSign.emoji} ${westernSign.sign} (${element}) a ${chinese?.emoji} ${chinese?.sign} – ukáž jak tato kombinace znamení formuje osobnost konkrétním a neopakovatelným způsobem.` : "Odhadni typ z dlaně konkrétně."}
Jemně naznač že právě tyto vlastnosti jsou pro moderní Praha 6 cenné.

── ODSTAVEC 2: CITY, VZTAHY, KOLEKTIV
Čára srdce + ${birthDate ? `živel ${element}` : "typ z čar"}. Propoj s lidským a férovým kolektivem Praha 6. Konkrétní předpověď – nové přátelství nebo spolupráce která může přijít.

── ODSTAVEC 3: ŽIVOTNÍ CESTA A ŠESTÝ OBVOD
Čára osudu se stáčí k šestému obvodu – přirozeně zakomponuj. ${birthDate && chinese ? `Propoj s ${chinese.emoji} ${chinese.sign} – načasování nebo typ změny.` : "Naznač příležitost z čar."}
Zmiň aspoň 2 lokální detaily z LOCAL FLAVOR PACKU – přirozeně, ne jako výčet.

── ODSTAVEC 4: KARIÉRA V RÁMCI PRAHY 6 / KITT6 – NEJDELŠÍ ČÁST
Vyber přesně 2 role z ROLE-PACKU (1 hlavní + 1 navazující nebo alternativní krok).
Zohledni senioritu (${band.seniority}) – napiš konkrétní trajektorii: kde začít, jak růst, jaký dopad mít.
Pokud IT role → povinně KITT6 dle pravidla.
Použij přesně 3 až 4 benefity z BENEFITY-PACKU.
Musí to znít jako přirozené uplatnění schopností návštěvníka – ne jako nabídka práce.

── ODSTAVEC 5: ZÁVĚREČNÉ POVZBUZENÍ
Osobní, konkrétní. Poslední věta MUSÍ být jedna z (pokaždé jinou):
"Tvůj další kariérní posun najdeš na www.kariera6.cz"
"Svoji budoucí kariéru najdeš na www.kariera6.cz"
"Hvězdy i čáry tvé dlaně ukazují jasně – více na www.kariera6.cz"
"Šestý obvod tě čeká – začni na www.kariera6.cz"
"Tvůj osud a Praha 6 mají mnoho společného – přesvědč se na www.kariera6.cz"

Nikdy nepodepisuj.`;

    const userText = `Toto je fotografie ruky návštěvníka kariérní akce Praha 6. Přečti dlaň a napiš věštbu.${
        userName ? ` Jméno: ${userName}.` : " Jméno není zadáno."
    }${
        gender ? ` Pohlaví: ${gender}.` : " Pohlaví není zadáno – piš neutrálně."
    }${
        birthDate ? ` Datum narození: ${birthDate}.` : " Datum není zadáno – věštbu zakládej jen na čarách."
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: imageData, detail: "high" } },
          ],
        },
      ],
      temperature: 0.95,
      max_tokens: 1400,
    });

    const result = completion.choices[0]?.message?.content?.trim() ?? "";

    const isRefusal =
        result === "" ||
        result.toUpperCase().includes("ODMÍTNUTO") ||
        result.toUpperCase().includes("I'M UNABLE") ||
        result.toUpperCase().includes("I AM UNABLE") ||
        result.toUpperCase().includes("I CANNOT") ||
        result.toUpperCase().includes("I'M SORRY") ||
        result.toUpperCase().includes("OMLOUVÁM SE") ||
        result.toUpperCase().includes("GENERAL READING") ||
        result.includes("---");

    if (!isRefusal) {
      return { reading: result, isError: false };
    }

    const fallback = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Napiš osobní věštbu z dlaně pro návštěvníka kariérní akce Praha 6. Fotografie není k dispozici – věštbu vymysli kreativně na základě astrologického profilu a osobních údajů, nebo odhadni typ osobnosti obecně. Nikdy se neomluvuj za chybějící fotografii. Začni rovnou oslovením: "${salutation}"`,
        },
      ],
      temperature: 0.95,
      max_tokens: 1400,
    });

    const fallbackResult = fallback.choices[0]?.message?.content?.trim() ?? "";

    return {
      reading: fallbackResult || `${salutation}\n\nČáry tvé dlaně hovoří jasně – čeká tě zajímavá cesta a Praha 6 nebo KITT6 by mohly být jejím dalším krokem. Šestý obvod tě čeká – začni na www.kariera6.cz`,
      isError: false,
    };

  } catch (error: any) {
    console.error("Chyba při generování věštby:", error?.message ?? error);
    const emergencySalutation = userName ? `${userName},`
        : gender === "žena" ? "Milá návštěvnice,"
            : gender === "muž" ? "Milý návštěvníku,"
                : "Vítej,";
    return {
      reading: `${emergencySalutation}\n\nČáry tvé dlaně vyzařují silnou energii a odhodlání. Tvoje schopnosti mají v moderní organizaci jako Praha 6 své přirozené místo. Šestý obvod tě čeká – začni na www.kariera6.cz`,
      isError: false,
    };
  }
}

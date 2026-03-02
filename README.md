# Palmistry AI 🔮🖐️

Oficiální aplikace pro věštění z ruky pomocí AI pro Career Expo Úřadu městské části Praha 6.

## 🌟 Funkce

- Nahrání nebo vyfocení dlaně
- Automatická detekce dlaně pomocí GPT-4o vision
- Generování osobní věštby v češtině
- Věštba zohledňuje jméno, pohlaví, datum narození, západní znamení, čínský horoskop a živel
- Sdílení věštby – stažení jako obrázek, tisk, sdílení přes nativní API

## 🚀 Tech Stack

- **Frontend:** Next.js s Reactem
- **Styly:** SASS
- **UI Komponenty:** shadcn/ui
- **Animace:** Framer Motion
- **Ikony:** Lucide React
- **API požadavky:** Axios

## 🧠 AI Model

- **Analýza dlaně a generování věštby:** OpenAI GPT-4o vision
- Dvoufázové zpracování: detekce ruky + generování věštby
- Fallback věštba pokud je fotografie nekvalitní nebo nečitelná
- Věštba vždy zahrnuje kariérní doporučení pro Úřad MČ Praha 6

## 🏗️ Struktura Projektu

- `components/` – React komponenty (FileUpload, PalmReading, ImagePreview, HowToUse aj.)
- `app/api/` – Next.js API routy
- `lib/` – Utility funkce, AI model, astrologie
- `public/` – Statické soubory

## 🚀 Lokální spuštění

1. Naklonovat repozitář:
```bash
git clone https://github.com/NatyKITT/Palm-Reader-AI-EXPO
```

2. Nainstalovat závislosti:
```bash
npm install
```

3. Vytvořit `.env.local` s následujícími klíči:
```env
OPENAI_API_KEY=tvuj_openai_api_klic
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Spustit vývojový server:
```bash
npm run dev
```

5. Otevřít [http://localhost:3000](http://localhost:3000) v prohlížeči.

## 📦 Build pro produkci
```bash
npm run build
```

## 🔐 Bezpečnost a architektura

- Stateless architektura – žádná databáze ani ukládání dat
- OpenAI API klíč je pouze na serveru, nikdy se nepošle klientovi
- Rate limiting podle IP adresy

## 🙏 Poděkování

- [OpenAI](https://openai.com) za poskytnutí GPT-4o modelu
- [Úřad MČ Praha 6](https://www.praha6.cz) za podporu projektu
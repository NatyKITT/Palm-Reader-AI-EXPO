# Palmistry AI 🔮🖐️

Oficiální aplikace pro věštění z ruky pomocí AI pro akci Městské části Praha 6.

## 🌟 Features/Funkce

- Nahrání nebo vyfocení dlaně
- Automatická detekce dlaně (pomocí GPT-4o-vision)
- Generování věštby (v češtině)
- Historie věšteb vázaná na cookie
- Vlastní URL pro každou věštbu + QR kód

## 🚀 Tech Stack

- **Frontend**: Next.js s Reactem
- **Styly**: SASS
- **UI Komponenty**: shadcn/ui
- **Animace**: Framer Motion
- **Ikony**: Lucide React, vlastní ikony
- **API Požadavky**: Axios
- **Data Uložiště**: Firebase, Firestore

## 🔐 Bezpečnost

- Každý uživatel dostane anonymní token do cookie
- Věštby v PastReadingsGallery jsou zobrazeny pouze tomu, kdo je vytvořil
- Přístup na URL věštby je možný přes QR kód

## 🧠 AI Modely

- **Kontrola a Analýza z ruky**: Open AI (GPT-4o-vision)

## 🏗️ Struktura Projektu

- `components/`: React komponenty (Hero, FileUpload, PalmReading, etc.)
- `pages/`: Next.js stránky a API routy
- `lib/`: Utility funkce a AI model interakce
- `public/`: Statické dokumenty (static assets)

## 🚀 Začínáme lokálně

1. Naklonovat repozitář:
   ```
   git clone https://github.com/NatyKITT/Palm-Reader-AI
   ```

2. Nainstalovat závislosti:
   ```
   npm install
   ```

3. Nastavit proměnné prostředí (environment variables):
   Založit `.env.local` složku s následujícími klíči:
   ```
   
   OPENAI_API_KEY=open_ai_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tvuj_projekt_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tvuj_projekt_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tvuj_projekt_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tvuj_projekt_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tvuj_projekt_app_id
   ```

4. Rozjeď development server:
   ```
   npm run dev
   ```

5. Otevři [http://localhost:3000](http://localhost:3000) v prohlížeči.

## 📦 Build pro produkci

   ```
   cross-env NODE_ENV=production npm run build
   ```

   ```
   npm run start
   ```

## 🙏 Poděkování

- [OpenAI](https://platform.openai.com/) za poskytnutí AI modelu, placená verze
- [Firebase](https://firebase.google.com/) pro ukládání dat v databázi, placená/neplacená free verze na zkoušku
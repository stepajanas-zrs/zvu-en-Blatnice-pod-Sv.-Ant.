# Blatnická Rezervace

Webová aplikace pro správu rezervací a ceníku pomocí Firebase Realtime Database.

## 🚀 Instalace a spuštění

### 1. Klonuj projekt
```bash
git clone https://github.com/stepajanas-zrs/zvu-en-Blatnice-pod-Sv.-Ant.
cd zvu-en-Blatnice-pod-Sv.-Ant.
```

### 2. Nainstaluj závislosti
```bash
npm install
npm install firebase
```

### 3. Vytvoř `.env.local`
Vytvoř soubor `.env.local` v kořeni projektu a vlož Firebase konfiguraci:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyOmhziltRaeZguyovprZ2Fq37MajMQ2aJQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=blatnice-rezervace.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://blatnice-rezervace-default-rtdb.europe-west1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=blatnice-rezervace
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=blatnice-rezervace.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=223258741477
NEXT_PUBLIC_FIREBASE_APP_ID=1:223258741477:web:94988b030d03fc6501e20c
```

### 4. Spusť projekt
```bash
npm run dev
```

Projekt bude dostupný na: **http://localhost:3000**

## 📋 Funkce

### Rezervace
- **Stránka**: `/rezervace-form`
- **API**: `/api/rezervace/add` (POST - přidání)
- **API**: `/api/rezervace/get` (GET - čtení)
- Uložení: Firebase Realtime Database

### Ceník
- **API**: `/api/cenik/add` (POST - přidání)
- **API**: `/api/cenik/get` (GET - čtení)
- Uložení: Firebase Realtime Database

## 📊 Firebase Struktura

```
blatnice-rezervace
├── rezervace/
│   ├── -ID1: { jmeno, email, telefon, datum, ... }
│   └── -ID2: { jmeno, email, telefon, datum, ... }
└── cenik/
    ├── -ID1: { nazev, cena, popis, kategorie }
    └── -ID2: { nazev, cena, popis, kategorie }
```

## 🔧 Technologie

- **Next.js** - React framework
- **Firebase Realtime Database** - Cloud databáze
- **Vercel** - Hosting

## 📝 Poznámky

- Všechna data se ukládají do Firebase
- Web funguje online bez lokálního terminálu
- Data se automaticky synchronizují

## ✅ Co je hotovo

- ✅ Firebase integraci
- ✅ API pro rezervace
- ✅ API pro ceník
- ✅ Formulář pro rezervace
- ✅ Dokumentace

---

**Vytvořeno**: 2026-07-29

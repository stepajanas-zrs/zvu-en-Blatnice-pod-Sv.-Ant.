# Blatnická Rezervace 🎭

## 🚀 Funkčnosti

- ✅ Rezervační formulář s validací
- ✅ Interaktivní kalendář (volno vs. obsazeno)
- ✅ Typy akcí (Svatba, Cinibál, Koncert, Mluvené slovo)
- ✅ Email notifikace (vlastník + klient)
- ✅ Admin panel s přehledem a editací
- ✅ Responsive design

## 📋 Setup

### 1. Firebase

```bash
# Vytvoř Firebase projekt na https://firebase.google.com
# Zkopíruj konfiguraci do .env.local
cp .env.local.example .env.local
```

### 2. Email (Gmail)

```bash
# Vytvoř aplikační heslo na:
# https://myaccount.google.com/apppasswords

# Vlož do .env.local:
EMAIL_USER=tvoj_email@gmail.com
EMAIL_PASSWORD=tvoje_app_heslo
```

### 3. Admin přihlášení

```bash
# Výchozí údaje:
Email: admin@blatnice.cz
Heslo: admin123

# Změň v .env.local
```

### 4. Instalace

```bash
npm install
npm run dev
```

## 📍 Stránky

- **Formulář:** `/rezervace-form`
- **Admin přihlášení:** `/admin/login`
- **Admin panel:** `/admin/dashboard`

## 🔐 Bezpečnost

⚠️ **V produkci MĚNIT!**

- Používat NextAuth.js pro autentizaci
- Zašifrovat hesla
- Používat environment variables

## 📧 Email

Email notifikace se odesílají automaticky:

- ✅ **Klientovi:** Potvrzení rezervace
- ✅ **Adminovi:** Nová rezervace (s detaily)

---

**Vytvořeno pro ZVU Blatnické rezervace 🎭**

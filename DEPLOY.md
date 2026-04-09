# 🚀 DEPLOY GUIDE — Daily Dot Collector

## Tempo stimato: 10-15 minuti

---

## STEP 1: Setup Firebase (5 min)

1. Vai su https://console.firebase.google.com
2. Clicca "Add project" → nome: `daily-dot-collector` → Crea
3. **Authentication:**
   - Menu laterale → Authentication → Get started
   - Tab "Sign-in method" → Google → Enable → Salva
4. **Firestore Database:**
   - Menu laterale → Firestore Database → Create database
   - Seleziona "Start in test mode" → Scegli una location (europe-west) → Create
   - Vai su tab "Rules" e incolla il contenuto di `firestore.rules`
5. **Web App:**
   - Icona ingranaggio → Project settings → General
   - Scroll giù → "Your apps" → icona `</>` (Web)
   - Nome: `dot-collector` → Register app
   - **COPIA le credenziali** (apiKey, authDomain, projectId, ecc.)

## STEP 2: Configura il progetto (2 min)

1. Apri `src/firebase.js`
2. Sostituisci i placeholder con le tue credenziali Firebase:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← la tua
  authDomain: "daily-dot-collector.firebaseapp.com",
  projectId: "daily-dot-collector",
  storageBucket: "daily-dot-collector.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

## STEP 3: Deploy su Vercel (3 min)

### Opzione A: Via GitHub (consigliata)
1. Crea un repo su GitHub e pusha questo progetto
2. Vai su https://vercel.com → Sign up con GitHub
3. "Import Project" → seleziona il repo
4. Framework Preset: **Vite**
5. Deploy → fatto!

### Opzione B: Via CLI
```bash
npm install
npm run build
npx vercel --prod
```

## STEP 4: Dominio custom (opzionale, 2 min)

1. Su Vercel → Settings → Domains
2. Aggiungi il tuo dominio (es: `dotcollector.tuodominio.com`)
3. Configura il DNS come indicato da Vercel

---

## COSTO TOTALE

| Servizio | Piano | Costo |
|----------|-------|-------|
| Firebase Auth | Spark (free) | 0€ |
| Firestore | Spark (free) | 0€ fino a 50K letture/giorno |
| Vercel | Hobby (free) | 0€ |
| Dominio | Opzionale | ~10€/anno |

**Totale: 0€/mese** (fino a migliaia di utenti)

---

## STRUTTURA FILE

```
dot-collector-app/
├── index.html              # Entry HTML
├── package.json            # Dipendenze
├── vite.config.js          # Configurazione Vite
├── firestore.rules         # Regole sicurezza Firestore
├── DEPLOY.md               # Questa guida
└── src/
    ├── main.jsx            # Entry React
    ├── firebase.js         # ← CONFIGURA QUI le credenziali
    ├── App.jsx             # Componente principale
    ├── AuthScreen.jsx      # Schermata login
    ├── useStore.js         # Hook persistenza Firestore
    ├── constants.js        # Aree, colori, utility
    └── promptGenerator.js  # Genera il prompt per Claude
```

---

## NOTE PER IL LEAD MAGNET

Per usarlo come lead magnet (commento → accesso):
1. Puoi aggiungere una landing page prima del login
2. Oppure semplicemente condividi il link al sito
3. Il login con Google è già incluso — zero friction per l'utente
4. Ogni utente ha i suoi dati privati separati

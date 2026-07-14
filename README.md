# 💸 Conto Comune

Web app (PWA) per gestire spese condivise: più conti, saldo automatico, analisi mensili.
Ogni **account** (email + password) è un "conto comune" condiviso: chi ha le credenziali vede le stesse spese da qualsiasi dispositivo, in tempo reale.

## Configurazione Firebase (da fare una volta sola)

1. Vai su [console.firebase.google.com](https://console.firebase.google.com) e crea un progetto (es. `conto-comune`). Google Analytics non serve.
2. **Authentication** → Inizia → scheda *Sign-in method* → abilita **Email/password**.
3. **Firestore Database** → Crea database → modalità *produzione* → scegli una zona europea (es. `eur3`).
4. In Firestore, scheda **Regole**, incolla e pubblica:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /groups/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

5. Impostazioni progetto (⚙️) → *Le tue app* → aggiungi un'app **Web** (`</>`) → copia l'oggetto `firebaseConfig` e incolla i valori in [firebase-config.js](firebase-config.js).
6. Sempre in Authentication → *Settings* → *Authorized domains*: aggiungi il dominio GitHub Pages (es. `TUONOME.github.io`).

## Uso

- **Crea nuovo conto comune**: registra un account con email e password, poi condividi le credenziali con le persone del gruppo.
- Dentro ogni account puoi creare più conti (Casa, Viaggio…) con la barra in alto.
- Installabile come app: da Chrome Android "Installa app", da Safari iOS "Aggiungi a schermata Home".
- Funziona anche offline: le modifiche si sincronizzano al ritorno della connessione.

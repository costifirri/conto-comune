# 💸 Conto Comune

Web app (PWA) per gestire spese condivise: più conti, saldo automatico, analisi mensili, sincronizzazione in tempo reale.

Due modi di accedere, che convivono:
- **Email + password**: per creare e gestire i propri conti da qualsiasi dispositivo.
- **Link di invito**: dalla scheda "Persone" di un conto si genera un link; chi lo apre entra in quel conto direttamente, senza registrarsi (accesso anonimo). Il link contiene una chiave segreta: va condiviso solo con il gruppo.

## Configurazione Firebase (da fare una volta sola)

1. Vai su [console.firebase.google.com](https://console.firebase.google.com) e crea un progetto (es. `conto-comune`). Google Analytics non serve.
2. **Authentication** → Inizia → scheda *Sign-in method* → abilita **Email/password** e **Anonimo**.
3. **Firestore Database** → Crea database → modalità *produzione* → scegli una zona europea (es. `eur3`).
4. In Firestore, scheda **Regole**, incolla e pubblica:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // vecchio formato dati, tenuto per la migrazione automatica
       match /groups/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       // lista personale dei conti a cui ogni utente partecipa
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       // un documento per conto; l'id lungo e casuale fa da chiave del link di invito
       match /conti/{contoId} {
         allow get, create, update, delete: if request.auth != null;
         allow list: if false;
       }
     }
   }
   ```

5. Impostazioni progetto (⚙️) → *Le tue app* → aggiungi un'app **Web** (`</>`) → copia l'oggetto `firebaseConfig` e incolla i valori in [firebase-config.js](firebase-config.js).
6. Sempre in Authentication → *Settings* → *Authorized domains*: aggiungi il dominio GitHub Pages (es. `TUONOME.github.io`).

## Uso

- **Registrati** con email e password scegliendo tipo e nome del primo conto.
- Nella scheda **Persone** trovi "🔗 Condividi link di invito" per far entrare il gruppo senza password.
- Puoi creare più conti (Casa, Viaggio…) con la barra in alto; "Esci solo tu" abbandona un conto, "Elimina per tutti" lo cancella definitivamente.
- Installabile come app: da Chrome Android "Installa app", da Safari iOS "Aggiungi a schermata Home".
- Funziona anche offline: le modifiche si sincronizzano al ritorno della connessione.

import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, signInAnonymously} from 'firebase/auth';

// Firebase Storage se již nepoužívá – obrázky se zpracovávají lokálně jako base64

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  signInAnonymously(auth)
    .then(() => console.log('Přihlášen anonymně'))
    .catch((err) => console.error('Anonymní přihlášení selhalo:', err));
}

export {db, auth};

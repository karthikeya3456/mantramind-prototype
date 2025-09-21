import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// It's good practice to initialize Analytics, though it might not be used directly in the code
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);

  // Initialize App Check
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LdvqBQqAAAAAM_2Yssq5tT5H3d8WeY0hS8a-Y2t'), // Replace with your reCAPTCHA site key
    isTokenAutoRefreshEnabled: true,
  });
}

export { app, auth, db, analytics };

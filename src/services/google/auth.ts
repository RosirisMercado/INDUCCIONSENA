import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';
import { updateStatus } from './status';
import { ensureSpreadsheetExists } from './sheets';
import { flushQueue } from './sync';

// Initialize Firebase App safely (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Google Auth Provider with confirmed Workspace scopes configured
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Forces consent prompt so Google always shows permission checkboxes
googleProvider.setCustomParameters({
  prompt: 'consent',
  include_granted_scopes: 'true'
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function setCachedToken(token: string | null): void {
  cachedAccessToken = token;
}

/**
 * Validates which scopes were granted to the access token via Google tokeninfo
 */
export async function checkTokenScopes(token: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    if (res.ok) {
      const data = await res.json();
      return (data.scope || '').split(' ');
    }
  } catch (e) {
    console.warn('Advertencia verificando scopes con Google tokeninfo:', e);
  }
  return [];
}

/**
 * Initiates Google OAuth popup sign-in, validates credentials, creates/links spreadsheet,
 * and flushes pending sync queue.
 */
export async function signInWithGoogle(): Promise<{ user: User; accessToken: string }> {
  try {
    isSigningIn = true;
    updateStatus({ error: null, isSyncing: true });

    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google. Inténtalo de nuevo.');
    }

    cachedAccessToken = credential.accessToken;

    updateStatus({
      isConnected: true,
      userEmail: result.user.email,
      isSyncing: false,
      error: null
    });

    // Automatically prepare or locate spreadsheet in Google Drive
    try {
      await ensureSpreadsheetExists(cachedAccessToken);
    } catch (sheetErr: any) {
      console.warn('Aviso preparando hoja de cálculo:', sheetErr);
    }

    // Automatically push any queued apprentice records to the spreadsheet
    try {
      await flushQueue();
    } catch (flushErr: any) {
      console.warn('Aviso vaciando cola de registros:', flushErr);
    }

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error durante la autenticación con Google:', error);
    updateStatus({
      isSyncing: false,
      error: error.message || 'Error al iniciar sesión con Google'
    });
    throw error;
  } finally {
    isSigningIn = false;
  }
}

/**
 * Signs out from Firebase and Google OAuth, clearing in-memory token
 */
export async function signOutGoogle(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Aviso en signOut:', e);
  }
  cachedAccessToken = null;
  updateStatus({
    isConnected: false,
    userEmail: null,
    error: null
  });
}

/**
 * Initializes Firebase Auth state listener
 */
export function initGoogleAuth(
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) {
  return onAuthStateChanged(auth, async (user) => {
    if (user && cachedAccessToken) {
      updateStatus({ isConnected: true, userEmail: user.email });
      if (onSuccess) onSuccess(user, cachedAccessToken);
      flushQueue().catch(() => {});
    } else if (!user) {
      cachedAccessToken = null;
      updateStatus({ isConnected: false, userEmail: null });
      if (onFailure) onFailure();
    }
  });
}

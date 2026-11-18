import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { sanitizeUserProfileFields } from '../utils/inquiryValidation';

const ADMIN_EMAIL = 'teams@milkyboss.de';

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  authError: string | null;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

async function syncUserProfile(firebaseUser: User) {
  const safe = sanitizeUserProfileFields({
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    email: firebaseUser.email,
  });

  const userRef = doc(db, 'users', safe.uid);
  const privateRef = doc(db, 'users', safe.uid, 'private', 'info');

  let userSnap;
  try {
    userSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${safe.uid}`);
  }

  if (!userSnap.exists()) {
    const batch = writeBatch(db);
    batch.set(userRef, {
      uid: safe.uid,
      displayName: safe.displayName,
      photoURL: safe.photoURL,
      role: 'client',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (safe.email) {
      batch.set(privateRef, {
        uid: safe.uid,
        email: safe.email,
        updatedAt: serverTimestamp(),
      });
    }
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${safe.uid}`);
    }
    return;
  }

  const existingData = userSnap.data();
  if (
    existingData.displayName !== safe.displayName ||
    existingData.photoURL !== safe.photoURL
  ) {
    try {
      await updateDoc(userRef, {
        displayName: safe.displayName,
        photoURL: safe.photoURL,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${safe.uid}`);
    }
  }

  if (safe.email) {
    let privateSnap;
    try {
      privateSnap = await getDoc(privateRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${safe.uid}/private/info`);
    }

    if (!privateSnap.exists()) {
      const batch = writeBatch(db);
      batch.set(privateRef, {
        uid: safe.uid,
        email: safe.email,
        updatedAt: serverTimestamp(),
      });
      try {
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${safe.uid}/private/info`);
      }
    } else if (privateSnap.data().email !== safe.email) {
      try {
        await updateDoc(privateRef, {
          email: safe.email,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${safe.uid}/private/info`);
      }
    }
  }
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser && nextUser.emailVerified) {
        try {
          await syncUserProfile(nextUser);
        } catch (err) {
          console.error('Failed to sync user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code: unknown }).code)
          : '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setAuthError(
          error instanceof Error
            ? error.message
            : 'Google sign-in failed. Please try again.'
        );
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Sign-out failed.'
      );
    }
  };

  const isAdmin = Boolean(
    user && user.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL
  );

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        authError,
        isSigningIn,
        signInWithGoogle,
        logout,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
}

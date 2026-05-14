import { useState, useEffect, useCallback } from 'react';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const SETTINGS_CHANGE_EVENT = 'settingsChange';

function emitSettingsChange() {
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function useSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('userName'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false);
      
      if (currentUser) {
        setUserName(currentUser.displayName || currentUser.email);
        localStorage.setItem('userName', currentUser.displayName || currentUser.email || '');
        
        // Listen to settings
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubDoc = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (typeof data.isDarkMode === 'boolean') {
              setIsDarkMode(data.isDarkMode);
              localStorage.setItem('darkMode', String(data.isDarkMode));
            }
          } else {
             // Create initial profile
             setDoc(userRef, {
               uid: currentUser.uid,
               updatedAt: Date.now(),
               isDarkMode: localStorage.getItem('darkMode') === 'true',
               email: currentUser.email || '',
               userName: currentUser.displayName || currentUser.email || ''
             }).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}`));
          }
        }, (error) => handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`));
        
        return () => unsubDoc();
      } else {
        localStorage.removeItem('userName');
        setUserName(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!user) setUserName(localStorage.getItem('userName'));
      
      setIsDarkMode(localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches));
    };

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleStorageChange);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleStorageChange);
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(async () => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = !isDark;
    localStorage.setItem('darkMode', String(next));
    setIsDarkMode(next);
    emitSettingsChange();
    
    if (auth.currentUser) {
       try {
         const userRef = doc(db, 'users', auth.currentUser.uid);
         await setDoc(userRef, {
           uid: auth.currentUser.uid,
           updatedAt: Date.now(),
           isDarkMode: next,
           email: auth.currentUser.email || '',
           userName: auth.currentUser.displayName || auth.currentUser.email || ''
         }, { merge: true });
       } catch (err) {
         handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
       }
    }
  }, []);
  
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      if (e?.code === 'auth/popup-closed-by-user') {
        console.log('Login popup was closed by the user.');
      } else {
        console.error('Login error:', e);
      }
    }
  };

  const logoutAction = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userName');
      setUserName(null);
      emitSettingsChange();
    } catch(e) {
      console.error(e);
    }
  }, []);

  return { user, userName, login, logout: logoutAction, isDarkMode, toggleDarkMode, isInitializing };
}

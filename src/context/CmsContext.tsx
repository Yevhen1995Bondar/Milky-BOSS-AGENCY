import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useFirebase } from './FirebaseContext';
import { useLanguage } from './LanguageContext';
import { sanitizeCmsOverrides } from '../utils/cmsUtils';

export type AdminTab = 'leads' | 'editor';

interface CmsContextValue {
  savedOverrides: Record<string, string>;
  draftOverrides: Record<string, string>;
  editMode: boolean;
  setEditMode: (next: boolean) => void;
  toggleEditMode: () => void;
  getText: (key: string, fallback: string, shared?: boolean) => string;
  setOverrideValue: (key: string, value: string, shared?: boolean) => void;
  resetOverrideValue: (key: string, shared?: boolean) => void;
  resolveContentKey: (key: string, shared?: boolean) => string;
  hasUnsavedChanges: boolean;
  dirtyCount: number;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  adminModalOpen: boolean;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  openAdminModal: (tab?: AdminTab) => void;
  closeAdminModal: () => void;
  contentLoaded: boolean;
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined);

const SITE_CONTENT_DOC_PATH = 'site_content/main';

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useFirebase();
  const { language } = useLanguage();

  const [savedOverrides, setSavedOverrides] = useState<Record<string, string>>({});
  const [draftOverrides, setDraftOverrides] = useState<Record<string, string>>({});
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const [editMode, setEditModeState] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.toLowerCase() === '#admin';
    }
    return false;
  });
  const [adminTab, setAdminTab] = useState<AdminTab>('leads');

  // Sync #admin URL hash listener
  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setAdminModalOpen(true);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Load live published overrides from Cloud Firestore site_content/main for all visitors
  useEffect(() => {
    const contentRef = doc(db, 'site_content', 'main');
    const unsubscribe = onSnapshot(
      contentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const rawFields =
            data && typeof data.fields === 'object' && data.fields !== null
              ? (data.fields as Record<string, unknown>)
              : {};
          const clean = sanitizeCmsOverrides(rawFields);
          setSavedOverrides(clean);
          setDraftOverrides((prev) => {
            // Only replace draft automatically if there are no local edits in progress
            const prevKeys = Object.keys(prev);
            if (prevKeys.length === 0) return clean;
            return prev;
          });
        } else {
          setSavedOverrides({});
        }
        setContentLoaded(true);
      },
      (error) => {
        setContentLoaded(true);
        try {
          handleFirestoreError(error, OperationType.GET, SITE_CONTENT_DOC_PATH);
        } catch {
          // Keep default static translations if offline or initial fetch fails
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Ensure draft synchronizes with savedOverrides when editMode is off
  useEffect(() => {
    if (!isAdmin) {
      setEditModeState(false);
      setDraftOverrides(savedOverrides);
    }
  }, [isAdmin, savedOverrides]);

  const dirtyKeys = useMemo(() => {
    const keys = new Set([
      ...Object.keys(savedOverrides),
      ...Object.keys(draftOverrides),
    ]);
    const changed: string[] = [];
    for (const k of keys) {
      if (savedOverrides[k] !== draftOverrides[k]) {
        changed.push(k);
      }
    }
    return changed;
  }, [savedOverrides, draftOverrides]);

  const hasUnsavedChanges = dirtyKeys.length > 0;
  const dirtyCount = dirtyKeys.length;

  const setEditMode = useCallback(
    (next: boolean) => {
      if (!isAdmin) {
        setEditModeState(false);
        return;
      }
      setEditModeState(next);
    },
    [isAdmin]
  );

  const toggleEditMode = useCallback(() => {
    if (!isAdmin) return;
    setEditModeState((prev) => !prev);
  }, [isAdmin]);

  const resolveContentKey = useCallback(
    (key: string, shared = false) => (shared ? key : `${language}.${key}`),
    [language]
  );

  const getText = useCallback(
    (key: string, fallback: string, shared = false): string => {
      const fullKey = resolveContentKey(key, shared);
      const source = isAdmin ? draftOverrides : savedOverrides;
      if (Object.prototype.hasOwnProperty.call(source, fullKey)) {
        return source[fullKey];
      }
      return fallback;
    },
    [resolveContentKey, isAdmin, draftOverrides, savedOverrides]
  );

  const setOverrideValue = useCallback(
    (key: string, value: string, shared = false) => {
      if (!isAdmin) return;
      const fullKey = resolveContentKey(key, shared);
      setSaveSuccess(false);
      setSaveError(null);
      setDraftOverrides((prev) => ({
        ...prev,
        [fullKey]: value,
      }));
    },
    [isAdmin, resolveContentKey]
  );

  const resetOverrideValue = useCallback(
    (key: string, shared = false) => {
      if (!isAdmin) return;
      const fullKey = resolveContentKey(key, shared);
      setSaveSuccess(false);
      setSaveError(null);
      setDraftOverrides((prev) => {
        const copy = { ...prev };
        delete copy[fullKey];
        return copy;
      });
    },
    [isAdmin, resolveContentKey]
  );

  const discardChanges = useCallback(() => {
    setDraftOverrides(savedOverrides);
    setSaveError(null);
    setSaveSuccess(false);
  }, [savedOverrides]);

  const saveChanges = useCallback(async () => {
    if (!isAdmin || !user) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const sanitized = sanitizeCmsOverrides(draftOverrides);
    try {
      await setDoc(doc(db, 'site_content', 'main'), {
        fields: sanitized,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      setSavedOverrides(sanitized);
      setDraftOverrides(sanitized);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Ошибка сохранения в Cloud Firestore'
      );
      try {
        handleFirestoreError(error, OperationType.WRITE, SITE_CONTENT_DOC_PATH);
      } catch {
        // Error surface already set in state
      }
    } finally {
      setIsSaving(false);
    }
  }, [isAdmin, user, draftOverrides]);

  const openAdminModal = useCallback((tab: AdminTab = 'leads') => {
    setAdminTab(tab);
    setAdminModalOpen(true);
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase() !== '#admin') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#admin`
      );
    }
  }, []);

  const closeAdminModal = useCallback(() => {
    setAdminModalOpen(false);
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#admin') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, []);

  return (
    <CmsContext.Provider
      value={{
        savedOverrides,
        draftOverrides,
        editMode,
        setEditMode,
        toggleEditMode,
        getText,
        setOverrideValue,
        resetOverrideValue,
        resolveContentKey,
        hasUnsavedChanges,
        dirtyCount,
        isSaving,
        saveError,
        saveSuccess,
        saveChanges,
        discardChanges,
        adminModalOpen,
        adminTab,
        setAdminTab,
        openAdminModal,
        closeAdminModal,
        contentLoaded,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
}

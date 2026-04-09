import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const clean = (obj) => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(clean);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) out[k] = clean(v);
    }
    return out;
  }
  return obj;
};

export function useStore(userId) {
  const [data, setData] = useState({ entries: {}, issues: [], profile: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (!cancelled && snap.exists()) {
          const d = snap.data();
          // Backward compat: if no profile, set null (triggers onboarding)
          if (!d.profile) d.profile = null;
          setData(d);
          dataRef.current = d;
        }
        setError(null);
      } catch (e) {
        console.error('Load error:', e);
        if (!cancelled) setError('Errore caricamento dati.');
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  const persist = useCallback(async (d) => {
    if (!userId) return;
    dataRef.current = d;
    setData(d);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      setError(null);
      try {
        await setDoc(doc(db, 'users', userId), clean(d));
      } catch (e) {
        console.error('Save error:', e);
        setError('Salvataggio fallito. Riprova.');
      }
      setSaving(false);
    }, 800);
  }, [userId]);

  const forceSave = useCallback(async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', userId), clean(dataRef.current));
      setError(null);
    } catch (e) {
      setError('Salvataggio fallito.');
    }
    setSaving(false);
  }, [userId]);

  return { data, persist, dataRef, loading, saving, error, setError, forceSave };
}

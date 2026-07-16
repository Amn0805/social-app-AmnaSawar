// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

// Generic state <-> localStorage sync, for simple values like
// dark-mode preference. Post/user/comment/like data goes through
// utils/storage.js instead, since that data has real shape and rules.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`useLocalStorage: failed to write ${key}`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

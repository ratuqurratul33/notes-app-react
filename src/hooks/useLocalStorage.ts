import { useEffect, useState } from 'react';

function readStorage<T>(key: string, fallback: T | (() => T)): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored) as T;
  } catch (error) {
    console.warn(`Gagal membaca localStorage key "${key}":`, error);
  }
  return fallback instanceof Function ? fallback() : fallback;
}

function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Gagal menyimpan localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;

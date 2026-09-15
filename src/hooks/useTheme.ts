import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import type { Theme } from '../types';

const STORAGE_KEY = 'notes-app/theme';

function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, 'dark');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return { theme, toggleTheme };
}

export default useTheme;

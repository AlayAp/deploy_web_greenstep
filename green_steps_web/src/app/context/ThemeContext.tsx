'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeContextType = {
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;

    setIsDark(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  const toggleTheme = () => {
    if (isDark === null) return;
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  if (isDark === null) return null;

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

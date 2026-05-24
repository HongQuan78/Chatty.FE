import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'Light' | 'Dark' | 'System';
type ResolvedTheme = 'Light' | 'Dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme => (
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme-preference') as Theme;
    return saved || 'System';
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => (
    theme === 'System' ? getSystemTheme() : theme
  ));

  useEffect(() => {
    localStorage.setItem('theme-preference', theme);
    
    const root = window.document.documentElement;
    const nextResolvedTheme = theme === 'System' ? getSystemTheme() : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(nextResolvedTheme.toLowerCase());
    setResolvedTheme(nextResolvedTheme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'System') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const nextResolvedTheme = e.matches ? 'Dark' : 'Light';
      root.classList.add(nextResolvedTheme.toLowerCase());
      setResolvedTheme(nextResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

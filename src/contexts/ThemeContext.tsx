import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'Light' | 'Dark' | 'System';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme-preference') as Theme;
    return saved || 'System';
  });

  useEffect(() => {
    localStorage.setItem('theme-preference', theme);
    
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    root.classList.remove('light', 'dark');

    if (theme === 'Dark' || (theme === 'System' && systemPrefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  // Listen for system theme changes if set to System
  useEffect(() => {
    if (theme !== 'System') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

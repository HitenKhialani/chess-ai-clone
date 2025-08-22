import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'grid' | 'solve' | 'flux' | 'terra' | 'glacius';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('grid');

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('theme-grid', 'theme-solve', 'theme-flux', 'theme-terra', 'theme-glacius');
    // Add current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
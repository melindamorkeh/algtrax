"use client";

import { useEffect } from 'react';
import { useTheme } from './ClientThemeProvider';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme class to html element
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      bodyElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
      bodyElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}; 
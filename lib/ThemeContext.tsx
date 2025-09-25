import React, { createContext, useContext, useState } from 'react';

export interface Theme {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  shadow: string;
  disabled: string;
  elevation: {
    low: string;
    medium: string;
    high: string;
  };
  alert: string;
  campaign: string;
}

export const themes = {
  light: {
    background: '#f8fafe',
    surface: '#ffffff',
    surfaceVariant: '#f8fafe',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    primary: '#3498db',
    primaryVariant: '#438edaff',
    secondary: '#27ae60',
    accent: '#e74c3c',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    border: '#e1e8ed',
    shadow: '#000000',
    disabled: '#bdc3c7',
    elevation: {
      low: 'rgba(0,0,0,0.1)',
      medium: 'rgba(0,0,0,0.2)',
      high: 'rgba(0,0,0,0.3)',
    },
    alert: '#dc3545',
    campaign: '#28a745',
  } as Theme,
  dark: {
    background: '#1a1a1a',
    surface: '#2c2c2c',
    surfaceVariant: '#373737',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    primary: '#3498db',
    primaryVariant: '#438edaff',
    secondary: '#27ae60',
    accent: '#e74c3c',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    border: '#4a4a4a',
    shadow: '#000000',
    disabled: '#6c6c6c',
    elevation: {
      low: 'rgba(255,255,255,0.1)',
      medium: 'rgba(255,255,255,0.2)',
      high: 'rgba(255,255,255,0.3)',
    },
    alert: '#dc3545',
    campaign: '#28a745',
  } as Theme,
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    colors: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
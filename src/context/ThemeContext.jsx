import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Aplicar tema com CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      // MODO ESCURO
      root.style.setProperty('--title-color', '#FBCB4E');
      root.style.setProperty('--external-box', '#292535');
      root.style.setProperty('--internal-box', '#423E51');
      root.style.setProperty('--outline', '#7763B3');
      root.style.setProperty('--text-primary', '#EAEAEA');
      root.style.setProperty('--text-secondary', '#AFAFAF');
      root.style.setProperty('--sabidinho-bg', '#3B2868');
    } else {
      // MODO CLARO
      root.style.setProperty('--title-color', '#706496');
      root.style.setProperty('--external-box', '#9B8AC9');
      root.style.setProperty('--internal-box', '#D3C9F3');
      root.style.setProperty('--outline', '#706496');
      root.style.setProperty('--text-primary', '#706496');
      root.style.setProperty('--text-secondary', '#9687C8');
      root.style.setProperty('--sabidinho-bg', '#EAEAEA');
    }
    
    // Classes para o body (opcional)
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
export default ThemeContext;
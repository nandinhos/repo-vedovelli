import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar localStorage primeiro
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Senão, verificar preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    console.log('🎨 Aplicando tema:', theme); // DEBUG
    
    // Remover classes antigas
    root.classList.remove('light', 'dark');
    
    // Adicionar nova classe
    root.classList.add(theme);
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme);
    
    console.log('🎨 Classes no HTML:', root.className); // DEBUG
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

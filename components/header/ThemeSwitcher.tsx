'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'night' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <label className={`swap swap-rotate btn btn-circle btn-ghost ${className}`}>
    <input 
        type="checkbox" 
        checked={theme === 'night'}
        onChange={toggleTheme}
    />
    <Moon className="swap-off fill-current" size={24} />
    <Sun className="swap-on fill-current" size={24} />
    </label>
  );
}
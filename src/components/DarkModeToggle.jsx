import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-amber-500 animate-pulse" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;

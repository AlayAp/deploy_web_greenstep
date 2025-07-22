'use client';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 border rounded mt-4"
      aria-label="Toggle dark mode"
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

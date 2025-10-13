import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/useTheme.jsx';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full bg-card border-2 border-border flex items-center justify-center hover:scale-110 transition-transform"
      whileHover={{ rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === 'light' ? (
        <Sun className="w-6 h-6 text-primary" />
      ) : (
        <Moon className="w-6 h-6 text-primary" />
      )}
    </motion.button>
  );
};
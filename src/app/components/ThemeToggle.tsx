import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0"
      style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.22)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.12)')}
    >
      {theme === 'dark'
        ? <Sun size={15} style={{ color: '#a78bfa' }} />
        : <Moon size={15} style={{ color: '#a78bfa' }} />}
    </button>
  );
}

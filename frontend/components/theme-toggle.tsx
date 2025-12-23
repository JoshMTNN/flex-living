'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'fl-theme';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) || 'system';
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const applyTheme = (value: Theme) => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = value === 'system' ? (systemPrefersDark ? 'dark' : 'light') : value;
    root.classList.toggle('dark', resolved === 'dark');
  };

  const handleChange = (value: Theme) => {
    setTheme(value);
    localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  };

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center', className)}>
      {/* Mobile: shadcn select */}
      <div className="flex sm:hidden">
        <Select value={theme} onValueChange={(val) => handleChange(val as Theme)}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: chip toggle */}
      <div
        className={cn(
          'hidden sm:flex items-center gap-1 rounded-full border px-2 py-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur',
          'max-w-[230px] sm:max-w-none sm:flex-nowrap sm:gap-2 sm:px-3'
        )}
      >
        <ToggleChip
          icon={<Sun className="h-4 w-4" />}
          active={theme === 'light'}
          label="Light"
          onClick={() => handleChange('light')}
        />
        <ToggleChip
          icon={<Moon className="h-4 w-4" />}
          active={theme === 'dark'}
          label="Dark"
          onClick={() => handleChange('dark')}
        />
        <ToggleChip
          icon={<Monitor className="h-4 w-4" />}
          active={theme === 'system'}
          label="System"
          onClick={() => handleChange('system')}
        />
      </div>
    </div>
  );
}

function ToggleChip({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors',
        active
          ? 'bg-[#045a38] text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-around p-1">
      <button
        onClick={() => setTheme('light')}
        className="flex flex-1 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className="flex flex-1 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className="flex flex-1 items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
        title="System Mode"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}

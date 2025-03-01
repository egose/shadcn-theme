import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../package/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#228be6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6c757d',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#28a745',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#fab005',
          foreground: '#ffffff',
        },
        danger: {
          DEFAULT: '#dc3545',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#17a2b8',
          foreground: '#ffffff',
        },
        light: {
          DEFAULT: '#f8f9fa',
          foreground: '#000000',
        },
        dark: {
          DEFAULT: '#343a40',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#D2575A',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#7950F2',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f7f7f7',
          foreground: '#8e8e8e',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config;

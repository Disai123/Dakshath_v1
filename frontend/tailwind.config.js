/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gnanamai Deep Navy (primary brand color)
        primary: {
          DEFAULT: '#1e3a5f',
          hover: '#16304f',
          pressed: '#0f2540',
          light: '#e8edf5',
          dark: '#0f2540',
          50: '#e8edf5',
          100: '#c5d3e8',
          200: '#9fb8d9',
          300: '#789cca',
          400: '#5a86be',
          500: '#1e3a5f',
          600: '#16304f',
          700: '#0f2540',
          800: '#091a30',
          900: '#040e1f',
        },
        // Gnanamai Academic Gold (secondary)
        secondary: {
          DEFAULT: '#c9a227',
          hover: '#a88520',
          light: '#fdf6dc',
          dark: '#7a5f0f',
          50: '#fefce8',
          100: '#fdf6dc',
          200: '#faedb0',
          300: '#f5df78',
          400: '#eecb40',
          500: '#c9a227',
          600: '#a88520',
          700: '#7a5f0f',
          800: '#5a4408',
          900: '#3d2e04',
        },
        // Warm Amber (premium accent)
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fef3c7',
          dark: '#92400e',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5'
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7'
        },
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#FEE2E2'
        },
        cyan: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          light: '#cffafe'
        },
        // Aliases kept for existing class names (navy / gold palette)
        magic: {
          blue: '#1e3a5f',
          purple: '#c9a227',
          pink: '#eecb40'
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      },
      boxShadow: {
        'magic': '0 10px 40px -10px rgba(30, 58, 95, 0.35)',
        'magic-lg': '0 20px 60px -15px rgba(30, 58, 95, 0.4)',
        'glow': '0 0 20px rgba(201, 162, 39, 0.45)',
        'glow-lg': '0 0 40px rgba(201, 162, 39, 0.55)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll': 'scroll 30s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' }
        }
      },
      backgroundImage: {
        'gradient-magic': 'linear-gradient(135deg, #1e3a5f 0%, #c9a227 100%)',
        'gradient-disney': 'linear-gradient(135deg, #1e3a5f 0%, #c9a227 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)',
        'gradient-rainbow': 'linear-gradient(90deg, #1e3a5f, #c9a227, #eecb40, #f5df78, #faedb0)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      }
    },
  },
  plugins: [],
}

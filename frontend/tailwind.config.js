/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Disney Magic Blue (inspired by Disney castle)
        primary: {
          DEFAULT: '#0066CC',
          hover: '#0052A3',
          pressed: '#003D7A',
          light: '#E6F2FF',
          dark: '#002952'
        },
        // Disney Purple (magical, whimsical)
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#EDE9FE',
          dark: '#5B21B6'
        },
        // Disney Gold (sparkle, premium)
        accent: {
          DEFAULT: '#FFD700',
          hover: '#FFC700',
          light: '#FFF9E6',
          dark: '#B8860B'
        },
        // Success (Disney green)
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5'
        },
        // Warning (Disney orange/amber)
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7'
        },
        // Error (Disney red)
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          light: '#FEE2E2'
        },
        // Disney Pink (playful)
        pink: {
          DEFAULT: '#EC4899',
          hover: '#DB2777',
          light: '#FCE7F3'
        },
        // Magical gradients
        magic: {
          blue: '#4F46E5',
          purple: '#7C3AED',
          pink: '#EC4899'
        },
        // Neutral grays (softer, warmer)
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Poppins', 'sans-serif'], // Playful Disney-style font
        body: ['Poppins', 'sans-serif']
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
        'magic': '0 10px 40px -10px rgba(79, 70, 229, 0.3)',
        'magic-lg': '0 20px 60px -15px rgba(79, 70, 229, 0.4)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.6)',
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
        'gradient-magic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-disney': 'linear-gradient(135deg, #0066CC 0%, #8B5CF6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-rainbow': 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DFE6E9)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Extracted from the Genta logo: violet-to-magenta metal with a
        // warm gold edge-light on a near-black ground.
        void: {
          950: '#07050B',
          900: '#0B0812',
          800: '#120D1D',
          700: '#1B1428'
        },
        orchid: {
          400: '#C77DFF',
          500: '#A63FE0',
          600: '#8A2BE2',
          700: '#6C1EC9'
        },
        gold: {
          300: '#F5D98A',
          400: '#EFC565',
          500: '#E0A93C'
        },
        mist: {
          400: '#9C93AD',
          300: '#BDB4CC',
          200: '#E4DEEE'
        }
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"General Sans"', 'sans-serif'],
        body: ['"General Sans"', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'genta-radial':
          'radial-gradient(120% 120% at 50% -10%, rgba(166,63,224,0.35) 0%, rgba(7,5,11,0) 55%)',
        'genta-glow':
          'linear-gradient(135deg, #C77DFF 0%, #8A2BE2 45%, #6C1EC9 75%, #EFC565 130%)',
        'glass-sheen':
          'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0) 100%)'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(166,63,224,0.35)'
      },
      backdropBlur: {
        xl2: '40px'
      },
      borderRadius: {
        xl2: '1.75rem',
        xl3: '2.25rem'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.6s infinite linear',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}

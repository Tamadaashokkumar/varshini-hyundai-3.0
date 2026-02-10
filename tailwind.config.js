/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hyundai: {
          midnight: '#002C5F',
          blue: '#00AAD2',
          silver: '#C0C0C0',
          platinum: '#E5E4E2',
          obsidian: '#0A0E27',
          chrome: '#F0F0F0',
        },
        accent: {
          gold: '#D4AF37',
          electric: '#00F0FF',
          carbon: '#1A1A1A',
        }
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'metallic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'chrome-gradient': 'linear-gradient(90deg, #C0C0C0 0%, #F0F0F0 50%, #C0C0C0 100%)',
      },
      // 🔥 ADDED: Animation Config
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        // 👇 New Gradient Animation added here
        'gradient-slow': 'gradient 15s ease infinite',
      },
      // 🔥 ADDED: Keyframes Config
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 170, 210, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 170, 210, 0.8), 0 0 30px rgba(0, 170, 210, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // 👇 New Gradient Keyframes added here
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
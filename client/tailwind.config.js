/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        ui: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.4' }],
        body:    ['14px', { lineHeight: '1.6' }],
        ui:      ['16px', { lineHeight: '1.5' }],
        subhead: ['20px', { lineHeight: '1.3' }],
        h2:      ['24px', { lineHeight: '1.2' }],
        h1:      ['32px', { lineHeight: '1.1' }],
        hero:    ['clamp(48px, 6vw, 72px)', { lineHeight: '1.02' }],
      },
      colors: {
        canvas: '#f4f5f1',
        card:   '#ffffff',
        ink:    '#121815',
        muted:  '#5c6761',
        line:   '#dbe1dc',
        accent: '#c1492c',
        semantic: {
          successBg:   '#eaf3ed',
          successText: '#2d5a43',
          warningBg:   '#fdf3e7',
          warningText: '#a66218',
          errorBg:     '#faeaea',
          errorText:   '#c1492c',
          mutedBg:     '#ededeb',
          mutedText:   '#808581',
        },
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

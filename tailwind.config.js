/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Playfair Display SC', 'serif'],
        },
        backgroundImage:{
          mobile:"url('./src/assets/bg-mobile.png')",
          desktop:"url('./src/assets/bg-desktop.png')",
        },
        animation: {
          'bounce-once': 'bounceOnce 1s ease-out',
        },
        keyframes: {
          bounceOnce: {
            '0%, 100%': {
              transform: 'translateY(0)',
              animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
            },
            '50%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            },
          },
        },
      },
    },
    plugins: [],
};
  
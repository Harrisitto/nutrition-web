/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom nutrition app colors
        'dark-green': '#2b3618',
        'fade-dark-green': 'rgba(43, 54, 24, 0.6)',
        'nutrition-green': '#455e19',
        'black-green': '#14190b',
        'white-green': '#eaeee5',
        'fade-white-green': 'rgba(234, 238, 229, 0.6)',
        'fade-white': 'rgba(255, 255, 255, 0.5)',
        'fade-green': 'rgba(47, 59, 26, 0.2)',
        'nutrition-blue': '#30556b',
        'nutrition-purple': '#6b2f55',
        'nutrition-red': '#700f0f',
      },
    },
  },
}
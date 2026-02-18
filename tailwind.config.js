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
        // Text colors
        'text-title': '#2b3618',
        'text-subtitle': '#455e19',
        'text-body': '#14190b',
        'text-muted': 'rgba(43, 54, 24, 0.6)',
        'text-light': '#eaeee5',
        // Gray-blue colors for inputs
        'gray-blue-50': '#f8f9fb',
        'gray-blue-100': '#f0f3f7',
        'gray-blue-200': '#d9e0e8',
        'gray-blue-300': '#b8c5d6',
        'gray-blue-400': '#8fa3b8',
        'gray-blue-500': '#5a7a93',
        'gray-blue-600': '#4a6578',
        'gray-blue-700': '#3a515f',
      },
    },
  },
}
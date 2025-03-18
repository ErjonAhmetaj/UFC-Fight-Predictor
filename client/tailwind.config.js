/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fighter-card': '#1E1E1E',
        'fighter-bg': '#121212',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-gray-900',
    'text-white',
    'text-gray-300',
    'text-purple-400',
    'border-purple-500',
  ]
}

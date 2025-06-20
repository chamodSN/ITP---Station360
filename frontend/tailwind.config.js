
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#5F6FFF",
        brightNavyBlue: '#5F6FFF',    
        bleuDeFrance: '#318CE7', 
        charcoal: '#36454F', 
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      }
    },
  },
  plugins: [],

};



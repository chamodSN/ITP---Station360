
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"  // Ensures Tailwind scans your components
  ],
  theme: {
        extend: {
          colors: {
            'primary': "#5F6FFF",
          }
        },
        gridTemplateColumns: {
          'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
        }
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}


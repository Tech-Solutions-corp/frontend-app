/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaria: "#6C47FF",
        fundo: "#F4F2FF",
        titulo: "#1A1A2E",
        subtitulo: "#999999",
        "icone-rosa": "#FFE5E5",
        "icone-lilas": "#E5E5FF",
      },
    },
  },
  plugins: [],
};

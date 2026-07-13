/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT:"#FF5A5F", hover:"#E0484D", light:"#FFF0F0" },
        secondary: "#00A699",
        dark: { DEFAULT:"#222222", light:"#484848", lighter:"#767676" },
      },
      fontFamily: { sans:["Inter","system-ui","sans-serif"] },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.12)",
        hover: "0 4px 24px rgba(0,0,0,0.18)",
        navbar: "0 1px 12px rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp: { from:{ opacity:0, transform:"translateY(20px)" }, to:{ opacity:1, transform:"translateY(0)" } },
      },
    },
  },
  plugins: [],
};

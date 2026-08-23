/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F5",
        pearl: "#F7F4EF",
        white: "#FFFFFF",
        beige: "#D8C3A5",
        gold: "#C9A96E",
        "gold-dark": "#B4915A",
        clay: "#7B5E57",
        ink: "#1C1C1C",
        slate: "#555555",
        // dark mode surfaces, kept in the same warm family
        "ink-950": "#15130F",
        "ink-900": "#1E1B16",
        "ink-800": "#292420",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(28, 28, 28, 0.12)",
        lift: "0 24px 60px -20px rgba(28, 28, 28, 0.25)",
        gold: "0 8px 30px -6px rgba(201, 169, 110, 0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A96E 0%, #D8C3A5 50%, #B4915A 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(3deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        floatSlow: "float 12s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

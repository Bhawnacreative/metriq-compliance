/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["Space Grotesk", "sans-serif"], sans: ["DM Sans", "sans-serif"] },
      boxShadow: { glow: "0 0 45px rgba(255,90,95,.22)" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0) rotateY(-4deg)" }, "50%": { transform: "translateY(-14px) rotateY(4deg)" } },
        beam: { "0%": { top: "8%", opacity: .25 }, "45%": { opacity: 1 }, "100%": { top: "88%", opacity: .25 } },
        spinSlow: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        shimmer: { "0%": { backgroundPosition: "-500px 0" }, "100%": { backgroundPosition: "500px 0" } }
      },
      animation: { float: "float 5s ease-in-out infinite", beam: "beam 2.1s ease-in-out infinite", spinSlow: "spinSlow 12s linear infinite", shimmer: "shimmer 2s linear infinite" }
    }
  },
  plugins: []
};
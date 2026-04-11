module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "gradient-radial-overlay": "radial-gradient(circle at 50% 50%, rgba(79, 158, 248, 0.05) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "hero-title": "fadeInUp 0.8s ease-out 0.1s both",
        "hero-subtitle": "fadeInUp 0.8s ease-out 0.2s both",
        "hero-buttons": "fadeInUp 0.8s ease-out 0.3s both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": {
            opacity: 0,
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      boxShadow: {
        "soft": "0 10px 30px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 15px 40px rgba(0, 0, 0, 0.12)",
        "soft-xl": "0 20px 50px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}


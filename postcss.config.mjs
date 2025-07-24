const config = {
  plugins: process.env.VITEST ? [] : ["@tailwindcss/postcss"],
};

export default config;

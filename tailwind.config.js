// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // pages 디렉토리
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // components 디렉토리
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // app 디렉토리
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // 사용자 정의 색상
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

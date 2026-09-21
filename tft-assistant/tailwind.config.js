/** @type {import('tailwindcss').Config} */

// 品牌霓虹青阶（替代默认 purple/violet/fuchsia/indigo）
const neonScale = {
  50: '#ecfdfb',
  100: '#cffaf4',
  200: '#a1f4e9',
  300: '#6ceddd',
  400: '#4aefe0',
  500: '#33e6d5',
  600: '#17c9b8',
  700: '#13a396',
  800: '#14817a',
  900: '#156a64'
}

// 品牌金橙阶（替代默认 pink；原 purple→pink 渐变自然变为 青→金）
const goldScale = {
  50: '#fff9eb',
  100: '#ffefc6',
  200: '#ffdd88',
  300: '#ffc857',
  400: '#ffc15c',
  500: '#ffb133',
  600: '#f59a12',
  700: '#cc7a08',
  800: '#a15f0e',
  900: '#834e0f'
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // 全站旧紫粉色体系统一映射到霓虹青/金
        purple: neonScale,
        violet: neonScale,
        fuchsia: neonScale,
        indigo: neonScale,
        pink: goldScale
      }
    },
  },
  plugins: [],
}

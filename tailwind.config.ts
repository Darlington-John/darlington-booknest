import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
grey: '#707070',
lightGrey: '#cfccc9',
black: '#000',
red: '#D14031',
green: '#054f31',
white:'#fff',
pink: '#F6D9D5'
    },
    screens: {
      '4xl': '1600px',
      '3xl': { max: '1535px' },
      
      '2xl': { max: '1400px' },
      xl: { max: '1279px' },
      

      lg: { max: '1023px' },
      

      md: { max: '767px' },
      

      sm: { max: '639px' },
      xs: { max: '575px' },
      dxs: { max: '500px' },
      '2xs': { max: '400px' },
      
  },
    extend: {},
  },
  plugins: [],
};
export default config;

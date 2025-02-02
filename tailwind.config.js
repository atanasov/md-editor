/** @type {import('tailwindcss').Config} */
import  daisyui  from 'daisyui';

export default {
	content: ['./frontend/index.html', './frontend/src/**/*.{svelte,js,ts,jsx,tsx}'],
	daisyui: {
		themes: ['light', 'dark'],
	},
	theme: {
		extend: {},
	},
	plugins: [daisyui],
};

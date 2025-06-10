import { createTheme } from '@mui/material/styles';
import { createContext, useMemo, useState } from 'react';

// color design tokens export
export const tokens = (mode) => ({
	...(mode === 'dark'
		? {
				grey: {
					100: '#e0e0e0',
					200: '#c2c2c2',
					300: '#a3a3a3',
					400: '#858585',
					500: '#666666',
					600: '#525252',
					700: '#3d3d3d',
					800: '#292929',
					900: '#141414',
				},
				primary: {
					100: '#d0d1d5',
					200: '#a1a4ab',
					300: '#727681',
					400: '#1F2A40',
					500: '#141b2d',
					600: '#101624',
					700: '#0c101b',
					800: '#080b12',
					900: '#040509',
				},
				yellowAccent: {
					100: '#ffeece',
					200: '#ffde9d',
					300: '#ffcd6b',
					400: '#ffbd3a',
					500: '#ffac09',
					600: '#cc8a07',
					700: '#996705',
					800: '#664504',
					900: '#332202',
				},

				redAccent: {
					100: '#f7d6d6',
					200: '#efacac',
					300: '#e78383',
					400: '#df5959',
					500: '#d73030',
					600: '#ac2626',
					700: '#811d1d',
					800: '#561313',
					900: '#2b0a0a',
				},

				orangeAccent: {
					100: '#ffdfce',
					200: '#ffc09d',
					300: '#ffa06c',
					400: '#ff813b',
					500: '#ff610a',
					600: '#cc4e08',
					700: '#993a06',
					800: '#662704',
					900: '#331302',
				},

				blueAccent: {
					100: '#d6d6de',
					200: '#acaebd',
					300: '#83859b',
					400: '#595d7a',
					500: '#303459',
					600: '#262a47',
					700: '#1d1f35',
					800: '#131524',
					900: '#0a0a12',
				},
		  }
		: {
				grey: {
					100: '#141414',
					200: '#292929',
					300: '#3d3d3d',
					400: '#525252',
					500: '#666666',
					600: '#858585',
					700: '#a3a3a3',
					800: '#c2c2c2',
					900: '#e0e0e0',
				},
				primary: {
					100: '#040509',
					200: '#080b12',
					300: '#0c101b',
					400: '#f2f0f0', // manually changed
					500: '#141b2d',
					600: '#1F2A40',
					700: '#727681',
					800: '#a1a4ab',
					900: '#d0d1d5',
				},
				yellowAccent: {
					100: '#332202',
					200: '#664504',
					300: '#996705',
					400: '#cc8a07',
					500: '#ffac09',
					600: '#ffbd3a',
					700: '#ffcd6b',
					800: '#ffde9d',
					900: '#ffeece',
				},

				redAccent: {
					100: '#2b0a0a',
					200: '#561313',
					300: '#811d1d',
					400: '#ac2626',
					500: '#d73030',
					600: '#df5959',
					700: '#e78383',
					800: '#efacac',
					900: '#f7d6d6',
				},

				orangeAccent: {
					100: '#331302',
					200: '#662704',
					300: '#993a06',
					400: '#cc4e08',
					500: '#ff610a',
					600: '#ff813b',
					700: '#ffa06c',
					800: '#ffc09d',
					900: '#ffdfce',
				},

				blueAccent: {
					100: '#0a0a12',
					200: '#131524',
					300: '#1d1f35',
					400: '#262a47',
					500: '#303459',
					600: '#595d7a',
					700: '#83859b',
					800: '#acaebd',
					900: '#d6d6de',
				},
		  }),
});

// mui theme settings
export const themeSettings = (mode) => {
	const colors = tokens(mode);
	return {
		palette: {
			mode: mode,
			...(mode === 'dark'
				? {
						// palette values for dark mode
						primary: {
							main: colors.primary[500],
						},
						secondary: {
							main: colors.orangeAccent[500],
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100],
						},
						background: {
							default: colors.primary[500],
						},
				  }
				: {
						// palette values for light mode
						primary: {
							main: colors.primary[100],
						},
						secondary: {
							main: colors.orangeAccent[500],
						},
						neutral: {
							dark: colors.grey[700],
							main: colors.grey[500],
							light: colors.grey[100],
						},
						background: {
							default: '#fcfcfc',
						},
				  }),
		},
		typography: {
			fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
			fontSize: 12,
			h1: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 40,
			},
			h2: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 32,
			},
			h3: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 24,
			},
			h4: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 20,
			},
			h5: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 16,
			},
			h6: {
				fontFamily: ['Source Sans 3', 'sans-serif'].join(','),
				fontSize: 14,
			},
		},
	};
};

// context for color mode
export const ColorModeContext = createContext({
	toggleColorMode: () => {},
});

export const useMode = () => {
	const [mode, setMode] = useState('dark');

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () =>
				setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
		}),
		[]
	);

	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
	return [theme, colorMode];
};

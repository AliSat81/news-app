import { extendTheme } from '@mui/joy/styles';

const lightMode = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',  // Primary color for light mode
    },
    background: {
      default: '#ffffff',  // Background color for light mode
      paper: '#f4f6f8',    // Paper color for surfaces
    },
    text: {
      primary: '#000000',  // Text color for light mode
    },
  },
};

const darkMode = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',    // Primary color for dark mode
    },
    background: {
      default: '#121212',  // Background color for dark mode
      paper: '#1e1e1e',    // Paper color for surfaces
    },
    text: {
      primary: '#ffffff',  // Text color for dark mode
    },
  },
};

const theme = extendTheme({
  light: lightMode,
  dark: darkMode,
  typography: {
    fontFamily: {
        display: "'Inter', var(--joy-fontFamily-fallback)",
        body: "'Inter', var(--joy-fontFamily-fallback)",
      },
  },
  components: {
    // Customize component styles here
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.color === 'primary' && {
            backgroundColor: ownerState.mode === 'light' ? '#1976d2' : '#90caf9',
          }),
        }),
      },
    },
  },
});

export default theme;

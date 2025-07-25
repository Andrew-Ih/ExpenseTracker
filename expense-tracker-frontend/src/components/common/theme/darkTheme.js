import { createTheme } from '@mui/material/styles';

// Define custom theme values
const themeValues = {
  colors: {
    gradient: {
      start: '#0f172a',
      end: '#1e293b'
    }
  }
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#030712',
      paper: '#111827',
      gradient: `linear-gradient(135deg, ${themeValues.colors.gradient.start} 0%, ${themeValues.colors.gradient.end} 100%)`,
    },
  },
  // Add custom theme values that can be accessed via theme.custom
  custom: {
    ...themeValues
  }
});

export default darkTheme;
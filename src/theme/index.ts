import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f7f7f8',
      paper: '#ffffff'
    },
    primary: {
      main: '#2563eb',
      light: '#60a5fa'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: 'none',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.05)'
        }
      }
    }
  }
});
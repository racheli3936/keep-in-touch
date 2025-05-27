import { createTheme } from "@mui/material";

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#6200EA', // Vibrant purple
      light: '#9D46FF',
      dark: '#4A00B0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF5722', // Vibrant orange
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#fff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#fff',
    },
    text: {
      primary: '#37474F',
      secondary: '#546E7A',
    },
    info: {
      main: '#00BCD4', // Cyan
    },
    success: {
      main: '#00C853', // Green
    },
    warning: {
      main: '#FFC107', // Amber
    },
    error: {
      main: '#F44336', // Red
    },
  },
  typography: {
    fontFamily: '"Assistant", "Roboto", "Arial", "sans-serif"',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 25px rgba(98, 0, 234, 0.15)',
        },
      },
    },
  },
});
export default theme;
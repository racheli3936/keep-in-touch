import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

// Create a custom theme with a modern color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f7",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #3f51b5 30%, #757de8 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #f50057 30%, #ff4081 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
})

// Animation variants for page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

// Animation variants for staggered children
export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

// Animation variants for hover effects
export const hoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.03,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}

export const PageContainer = ({ children }: { children: ReactNode }) => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className="w-full">
    {children}
  </motion.div>
)

export const StaggerContainer = ({ children }: { children: ReactNode }) => (
  <motion.div variants={staggerContainerVariants} initial="initial" animate="animate" className="w-full">
    {children}
  </motion.div>
)

export const StaggerItem = ({ children }: { children: ReactNode }) => (
  <motion.div variants={itemVariants}>{children}</motion.div>
)

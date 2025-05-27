// LoadingSpinner.tsx
import { CircularProgress, Box, Fade, Snackbar, Alert,Typography,Container, Divider  } from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import {CustomButton} from './myBotton';

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
    }}
  >
    <Fade in={true} timeout={700}>
      <Box>
        <CircularProgress size={80} thickness={5} sx={{ color: '#FFFFFF', opacity: 0.9 }} />
        <FamilyRestroomIcon />
      </Box>
    </Fade>
  </Box>
);

// MainContent.tsx
const MainContent = ({ children }:{children:any}) => (
  <Box component="main">
    <Container maxWidth="lg">
      <Box>{children}</Box>
    </Container>
  </Box>
);

// Footer.tsx
const Footer = () => (
  <Box
    component="footer"
    sx={{
      background: 'linear-gradient(90deg, #512DA8 0%, #673AB7 100%)',
      color: 'white',
      mt: 'auto',
      py: 3,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center' // הוספת סגנון למרכז את הכיתובים
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column', // שינוי ל-column כדי למרכז את התוכן
        alignItems: 'center', // מרכז את התוכן
        mb: { xs: 3, md: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FamilyRestroomIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            המרחב המשפחתי
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          חיבור משפחות וחברים באופן מושלם
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'left' }}>
        <CustomButton text="אודות" />
        <CustomButton text="תמיכה" />
        <CustomButton text="צור קשר" />
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
      <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} המרחב המשפחתי - כל הזכויות שמורות
      </Typography>
    </Container>
  </Box>
);

const CustomSnackbar = ({ open, onClose, message }:{open:any,onClose:any,message:string}) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
    <Alert onClose={onClose} severity="success" variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

export {CustomSnackbar,Footer,MainContent,  LoadingSpinner};


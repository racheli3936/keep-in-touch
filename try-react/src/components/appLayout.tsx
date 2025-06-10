import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './navBar';
import { User, UserContext } from '../types/types';
import Register from './register';
import Login from './login';
import HomePage from './homePage';
import UserAvatar from './userAvatar';
import Wellcome from './wellcome';
import { motion } from 'framer-motion';
import {Alert, Snackbar, Box, AppBar, Toolbar, Container, Grid, Typography, Fade,CircularProgress} from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const AppLayout = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User>({id:-1, name: '', phone: '', email: '', address: '', previousFamily: '', files: [], userGroups: []});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setPageLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);
  };

  const handleIsConnected = () => {
    setLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
    }, 600);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        }}>
        <Box sx={{ textAlign: 'center', position: 'relative'}}>
          <CircularProgress size={80} thickness={5} sx={{color: '#FFFFFF', opacity: 0.9,}}/>
          <Fade in={true} timeout={700}>
            <Box sx={{ width: 50, height: 50, borderRadius: '50%',
                bgcolor: '#FF5722', display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: 'white',  fontWeight: 'bold', fontSize: 22,
                position: 'absolute',  top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 2,
                boxShadow: '0 4px 15px rgba(255, 87, 34, 0.5)'}}>
              <FamilyRestroomIcon />
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2 }}};

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {y: 0, opacity: 1, transition: { duration: 0.5 }}};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',
      background: isConnected 
        ? 'linear-gradient(180deg, #e3f2fd 0%, #FFFFFF 100%)' 
        : 'linear-gradient(180deg, #f5f5f5 0%, #FFFFFF 100%)',
      backgroundAttachment: 'fixed'
    }}>
    <>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            backgroundColor: '#1976d2',
            color: '#ffffff', 
            '& .MuiAlert-icon': { color: '#ffffff' },
            borderRadius: 2, py: 1.5, px: 3,
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <UserContext.Provider value={{ user, setUser }}>
        {isConnected ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* App Bar */}
            <AppBar 
              position="sticky" 
              elevation={3}
              sx={{ background: 'linear-gradient(90deg, #001F3F 0%, #003366 100%)', borderBottom: 'none'}}>
              <Container maxWidth="xl">
                <Toolbar sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  py: { xs: 1, md: 1 },
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{bgcolor: '#FF5722', width: 40, height: 40, mr: 2, borderRadius: '50%',
                       display: 'flex', justifyContent: 'center', alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(255, 87, 34, 0.5)' }}>
                      <FamilyRestroomIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' }, color: 'white', fontFamily: '"Assistant", sans-serif', fontSize: '1.5rem'}}>
                      המרחב המשפחתי
                    </Typography>
                  </Box>  
                  <NavBar /> 
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <UserAvatar />
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>

            {/* Main content */}         
              <Container maxWidth="lg">
                  <Outlet />
              </Container>       
          </motion.div>
        ) : (
          // Login/Register/Welcome layout
          <motion.div variants={containerVariants} initial="hidden" animate={pageLoaded ? "visible" : "hidden"} style={{ width: '100%' }} >
            <Box>
              <motion.div variants={itemVariants}>
                <Wellcome />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2, mb: 6}}>
                  <Grid container spacing={3} justifyContent="center" maxWidth="md">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ height: '100%' }}>
                        <Register setIsConnected={handleIsConnected} showSnackbar={showSnackbar} />
                      </motion.div>                 
                      <motion.div whileHover={{ scale: 1.03 }}  whileTap={{ scale: 0.98 }} style={{ height: '100%' }}>
                        <Login setIsConnected={handleIsConnected} showSnackbar={showSnackbar} />
                      </motion.div>
                  </Grid>
                </Box>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <HomePage />
              </motion.div>
              
              {/* Simple footer for non-connected state */}
              <motion.div variants={itemVariants}>
                <Box 
                  component="footer" 
                  sx={{bgcolor: '#f5f5f5',py: 3, mt: 4, borderTop: '1px solid #e0e0e0',textAlign: 'center'}}>
                  <Container>
                    <Typography variant="body2" color="text.secondary">
                      &copy; {new Date().getFullYear()} המרחב המשפחתי - כל הזכויות שמורות
                    </Typography>
                  </Container>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </UserContext.Provider>
      </>
    </Box>
  );
};

export default AppLayout;
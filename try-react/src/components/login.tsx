import { useState, useContext, useRef } from 'react';
import { UserContext } from '../types/types';
import {
  Box, Modal, Typography, InputAdornment, useTheme, IconButton, Fade,
  Divider, CircularProgress, Alert, Tooltip
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CustomTextField from '../styleComponent/customInput';
import { RegisterLoginButton, FamilyAvatar, RegisterLoginPaper, SubmitButton } from '../styleComponent/loginRegisterButton';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsConnected, showSnackbar }: { setIsConnected: Function, showSnackbar: Function }) => {
  const [pressLogin, setPressLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const context = useContext(UserContext);
  const { setUser } = context;
  const theme = useTheme();
  const navigate = useNavigate()

  const handleLoginSubmit = () => {
    navigate('/login')
    setPressLogin(true);
  };

  const handleClose = () => {
    setPressLogin(false);
    setError('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await axios.post('https://localhost:7191/api/Auth/login', loginData);
      localStorage.setItem('token', response.data.token);

      const userRes = {
        ...response.data.user,
        files: [],
        userGroups: [],
      };

      if (!userRes.name || !userRes.phone || !userRes.address) {
        showSnackbar('לא עדכנת את כל הפרטים שלך עדיין נא לעדכן');
      }

      setUser(userRes);
      setPressLogin(false);
      navigate('/')
      showSnackbar('ההתחברות הצליחה!');
      setIsConnected();
    } catch (error:any) {
      if (error.status >= 400 && error.status < 500) {
        setError('ההתחברות נכשלה. אנא בדוק את פרטי הכניסה שלך.');
      }

      else {
        setError('ההתחברות נכשלה. שגיאה לא ידועה')
      }
      console.error('Login failed:', error);
    } finally {

      setLoading(false);
    }
  };

  const animationProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  };

  return (
    <>
      <Tooltip title="התחברות למערכת" arrow placement="top">
        <RegisterLoginButton onClick={handleLoginSubmit} whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} >
          <LoginIcon />כניסה
        </RegisterLoginButton>
      </Tooltip>
      <Modal
        open={pressLogin}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)'
          }
        }}
      >
        <Fade in={pressLogin} timeout={500}>
          <RegisterLoginPaper elevation={10}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FamilyAvatar />
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', color: theme.palette.primary.main, direction: 'rtl', mb: 1 }}>
                התחברות למערכת
              </Typography>

              <Typography
                variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: '80%', mb: 1 }}>
                ברוכים הבאים למרחב המשפחתי
              </Typography>
              <Divider sx={{ width: '60%', my: 2, opacity: 0.7 }} />
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontWeight: 500, alignItems: 'center', borderRadius: 3 }}>
                {error} </Alert>)}
            <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
              <CustomTextField type="email" inputRef={emailRef} label="אימייל" required />
              <CustomTextField
                type={showPassword ? 'text' : 'password'}
                inputRef={passwordRef}
                label="סיסמה"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>} />
              <motion.div {...animationProps}>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}>
                  {loading ? 'מתחבר...' : 'התחבר'}
                </SubmitButton>
              </motion.div>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  אין לך חשבון?{' '}
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => { handleClose(); }}>
                    הירשם עכשיו
                  </Typography>
                </Typography>
              </Box>
            </form>
          </RegisterLoginPaper>
        </Fade>
      </Modal>
    </>
  );
};
export default Login;
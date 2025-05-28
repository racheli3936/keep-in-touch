import { FormEvent, useContext, useRef, useState } from "react";
import { User, UserContext } from "../types/types";
import axios from "axios";
import { Box, Modal, Typography, useTheme, Fade, Divider, IconButton, Alert, CircularProgress, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CustomTextField from "../styleComponent/customInput";
import { RegisterLoginButton, FamilyAvatar, RegisterLoginPaper, SubmitButton } from "../styleComponent/loginRegisterButton";
import { useNavigate } from "react-router-dom";
import { errorAlert } from "../utils/usefulFunctions";

const Register = ({ setIsConnected, showSnackbar, }: { setIsConnected: () => void; showSnackbar: (message: string) => void; }) => {
    const [pressRegister, setPressRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const previousFamilyRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext);
    const theme = useTheme();

    const handleRegisterSubmit = () => {
        setPressRegister(true);
        navigate('/register')
    };
    const handleClose = () => {
        setPressRegister(false);
        setError('');
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const data = {
            name: nameRef.current?.value,
            phone: phoneRef.current?.value,
            email: emailRef.current?.value,
            address: addressRef.current?.value,
            previousFamily: previousFamilyRef.current?.value,
            password: passwordRef.current?.value,
        };
        try {
             await axios.get(`https://keepintouch.onrender.com/api/User/email/${emailRef.current?.value}`);
             setPressRegister(false)
          errorAlert('מייל זה כבר רשום במערכת')
        }
        catch (error:any){
            try {

                await new Promise(resolve => setTimeout(resolve, 800));
                const response = await axios.post("https://keepintouch.onrender.com/api/Auth/register", data);
                localStorage.setItem("token", response.data.token);
                const newUser: User = {
                    id: response.data.id,
                    files: [],
                    userGroups: [],
                    name: data.name || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    previousFamily: data.previousFamily || "",
                };
                setUser(newUser);
                setPressRegister(false);
                navigate('/')
                setIsConnected();
                showSnackbar("נרשמת בהצלחה!");
            } catch (error) {
                console.error("Register failed:", error);
                setError('ההרשמה נכשלה. אנא בדוק את הפרטים שהזנת ונסה שוב.');
            } finally {
                setLoading(false);
            }
        }

    };
    const animationProps = {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: 'spring', stiffness: 400, damping: 17 }
    };
    return (
        <>
            <Tooltip title="הרשמה למערכת" arrow placement="top">
                <RegisterLoginButton
                    onClick={handleRegisterSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }} >
                    <PersonAddIcon />  הרשמה
                </RegisterLoginButton>
            </Tooltip>
            <Modal
                open={pressRegister}
                onClose={handleClose}
                closeAfterTransition
                BackdropProps={{
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(3px)' }
                }} >
                <Fade in={pressRegister} timeout={500}>
                    <RegisterLoginPaper elevation={10}>
                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <FamilyAvatar />
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 'bold', color: theme.palette.primary.main, direction: 'rtl', mb: 1 }}>
                                הרשמה למערכת
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: '80%', mb: 1 }}>
                                הצטרפו למרחב המשפחתי שלנו
                            </Typography>
                            <Divider sx={{ width: '60%', my: 2, opacity: 0.7 }} />
                        </Box>
                        {error && (<Alert
                            severity="error"
                            sx={{ mb: 2, fontWeight: 500, alignItems: 'center', borderRadius: 3 }} >
                            {error}
                        </Alert>)}
                        <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
                            <CustomTextField inputRef={nameRef} label="שם" name='name' startAdornment={<AccountCircleIcon color="primary" />} />
                            <CustomTextField inputRef={previousFamilyRef} label="משפחה" name="family" startAdornment={<FamilyRestroomIcon color="primary" />} />
                            <CustomTextField inputRef={phoneRef} label="טלפון" name='phone' startAdornment={<PhoneIcon color="primary" />} />
                            <CustomTextField inputRef={emailRef} label="אימייל" type="email" name='email' startAdornment={<EmailIcon color="primary" />} />
                            <CustomTextField inputRef={addressRef} label="כתובת" name='address' startAdornment={<HomeIcon color="primary" />} />
                            <CustomTextField inputRef={passwordRef} label="סיסמה" name='password' type={showPassword ? "text" : "password"} startAdornment={<LockIcon color="primary" />}
                                endAdornment={
                                    <IconButton
                                        onClick={toggleShowPassword}
                                        edge="end"
                                        sx={{ color: theme.palette.text.secondary }}>
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>} />
                            <motion.div {...animationProps}>
                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}>
                                    {loading ? 'מבצע רישום...' : 'הרשם'}
                                </SubmitButton>
                            </motion.div>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    כבר יש לך חשבון?{' '}
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: theme.palette.primary.main, fontWeight: 'bold', cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                        onClick={() => { handleClose(); }}>התחבר עכשיו
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
export default Register;
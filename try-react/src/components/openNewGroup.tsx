import { FormEvent, useState } from "react";
import { Group } from "../types/types";
import axios from "axios";
import { Box, Modal,Typography,InputAdornment, useTheme, Fade,Avatar, Divider, IconButton, Alert, CircularProgress, Tooltip} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from '@mui/icons-material/Add';
import LockIcon from "@mui/icons-material/Lock";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { GroupButton, GroupPaper, StyledTextField, SubmitButton } from "../styleComponent/openNewGroup";
import GroupStore from "../stores/GroupStore";

const OpenNewGroup = () => {
    const [pressNewGroup, setPressNewGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupPassword, setGroupPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const theme = useTheme();

    const handleNewGroupSubmit = () => {
        setPressNewGroup(true);
        setError("");
        setSuccess("");
    };

    const handleClose = () => {
        setPressNewGroup(false);
        setError("");
        setSuccess("");
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const newGroup: Partial<Group> = {
            name: groupName,
            password: groupPassword,
            groupMembers: []
        };

        try {
            // Add a slight delay to show the loading effect
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const token = localStorage.getItem('token');
            const response = await axios.post('https://keepintouch.onrender.com/api/Group', newGroup, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess("הקבוצה נוצרה בהצלחה!");
            setGroupName(response.data.name);
            setGroupPassword("");
            await GroupStore.Groupslist.push(response?.data)
            // Close modal after a delay to show success message
            setTimeout(() => {
                setPressNewGroup(false);
            }, 1500);
          
            
        } catch (error:any) {
            console.error("Failed to create group:", error);
            setError(error.response?.data || "אירעה שגיאה ביצירת הקבוצה");
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
            <Tooltip title="פתיחת קבוצה חדשה" arrow placement="top">
                <GroupButton
                    onClick={handleNewGroupSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    <GroupAddIcon />
                    צור קבוצה חדשה
                </GroupButton>
            </Tooltip>

            <Modal
                open={pressNewGroup}
                onClose={handleClose}
                closeAfterTransition
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(3px)'
                    }
                }}
            >
                <Fade in={pressNewGroup} timeout={500}>
                    <GroupPaper elevation={10}>
                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    mb: 2,
                                    width: 70,
                                    height: 70,
                                    bgcolor: theme.palette.success.main,
                                    color: '#fff',
                                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                                }}
                            >
                                <GroupWorkIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.success.main,
                                    direction: 'rtl',
                                    mb: 1
                                }}
                            >
                                יצירת קבוצה חדשה
                            </Typography>
                            
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    maxWidth: '80%',
                                    mb: 1
                                }}
                            >
                                צור קבוצה חדשה לשיתוף במרחב המשפחתי
                            </Typography>
                            
                            <Divider sx={{ width: '60%', my: 2, opacity: 0.7 }} />
                        </Box>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 2, 
                                    fontWeight: 500, 
                                    alignItems: 'center',
                                    borderRadius: 3
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mb: 2, 
                                    fontWeight: 500, 
                                    alignItems: 'center',
                                    borderRadius: 3
                                }}
                            >
                                {success}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
                            <StyledTextField
                                fullWidth
                                label="שם הקבוצה"
                                variant="outlined"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <GroupWorkIcon color="success" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <StyledTextField
                                fullWidth
                                label="סיסמה לקבוצה"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                value={groupPassword}
                                onChange={(e) => setGroupPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="success" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                                sx={{ color: theme.palette.text.secondary }}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <motion.div {...animationProps}>
                                <SubmitButton
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                >
                                    {loading ? 'יוצר קבוצה...' : 'צור קבוצה'}
                                </SubmitButton>
                            </motion.div>
                        </form>
                    </GroupPaper>
                </Fade>
            </Modal>
        </>
    );
};

export default OpenNewGroup;
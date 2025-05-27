import { styled,Avatar, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
const RegisterLoginPaper = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // רוחב דינמי
    maxWidth: 450,
    borderRadius: 24,
    padding: theme.spacing(2),
    textAlign: 'center',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5F5 100%)',
    boxShadow: '0 15px 50px rgba(98, 0, 234, 0.2)',
    overflowY: 'auto', // הוספת גלילה
    maxHeight: '500px', // הגדרת גובה מקסימלי
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #6200EA, #9D46FF)'
    }
  }));
  
const RegisterLoginButton = styled(motion.button)(({ theme }) => ({
    padding: '10px 24px',
    borderRadius: '24px',
    border: 'none',
    background: theme.palette.primary.main,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(98, 0, 234, 0.3)',
    transition: 'all 0.3s ease',
}));
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useTheme } from '@mui/material/styles';

const FamilyAvatar = () => {
    const theme = useTheme();

    return (
        <Avatar 
            sx={{
                mb: 2,
                width: 70,
                height: 70,
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                boxShadow: '0 4px 20px rgba(98, 0, 234, 0.3)'
            }}>
            <FamilyRestroomIcon sx={{ fontSize: 40 }} />
        </Avatar>
    );
};

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: '12px',
  fontWeight: 'bold',
  fontSize: '1rem',
  borderRadius: 16,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  boxShadow: `0 8px 20px rgba(98, 0, 234, 0.3)`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 10px 25px rgba(98, 0, 234, 0.4)`,
    transform: 'translateY(-2px)',
    background: theme.palette.primary.dark,
  }
}));
export  {SubmitButton,RegisterLoginButton,RegisterLoginPaper,FamilyAvatar}
import { Button, Paper, styled, TextField } from "@mui/material";
import { motion } from "framer-motion";

const GroupButton = styled(motion.button)(({ theme }) => ({
    padding: '10px 24px',
    borderRadius: '24px',
    border: 'none',
    background: theme.palette.success.main,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
    transition: 'all 0.3s ease'
}));

const GroupPaper = styled(Paper)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    max-width: 400px;
    border-radius: 24px;
    padding: ${({ theme }) => theme.spacing(4)};
    text-align: center;
    background: linear-gradient(135deg, #FFFFFF 0%, #E8F5E9 100%);
    box-shadow: 0 15px 50px rgba(76, 175, 80, 0.2);
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2E7D32, #4CAF50);
    }
`;

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root': {
        fontSize: '0.95rem',
        color: theme.palette.text.secondary,
        fontWeight: 500,
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        transition: 'all 0.3s ease',
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.success.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: theme.palette.success.main,
        },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: theme.palette.success.main,
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: 16,
    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    boxShadow: `0 8px 20px rgba(76, 175, 80, 0.3)`,
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: `0 10px 25px rgba(76, 175, 80, 0.4)`,
        transform: 'translateY(-2px)',
        background: theme.palette.success.dark,
    }
}));
export {GroupButton,GroupPaper,SubmitButton,StyledTextField}
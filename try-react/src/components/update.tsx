import { FormEvent, useContext, useState } from "react";
import { User, UserContext } from "../types/types";
import axios from "axios";
import {  Box, Button, Modal, Typography } from "@mui/material";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {  successAlert } from "../utils/usefulFunctions";
const Update = () => {
    const [pressUpdate, setPressUpdate] = useState(true)
    const context = useContext(UserContext);
    const { user, setUser } = context;
    const [formData, setFormData] = useState({
        name: user?.name,
        phone: user?.phone,
        email: user?.email,
        address: user?.address,
        previousFamily: user?.previousFamily,
        password: ''
    });
  const handleValueChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value
    }));
};


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
       
        const token = localStorage.getItem('token'); // או איך שאתה שומר את הטוקן
        try {
                                          
            const response = await axios.put('https://keepintouch.onrender.com/api/User', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('User updated successfully', response.data);
            const newUser: User = {
                id:response.data.id,
                files: [],
                userGroups: [],
                name: formData.name || '', // ברירת מחדל במקרה של undefined
                phone: formData.phone || '',
                email: formData.email || '',
                address: formData.address || '',
                previousFamily: formData.previousFamily || ''
            };
            setUser(newUser)
            setPressUpdate(false); 
            successAlert('עדכנת בהצלחה!');
            // כאן תוכל להוסיף לוגיקה נוספת, כמו רענון הנתונים או מעבר לדף אחר
        } catch (error:any) {
            console.error('Failed to update user', error.response);
            // כאן תוכל להוסיף טיפול בשגיאות
        }
        
      
    }
    return (
        <>
            <Modal
                open={pressUpdate}
                onClose={() => setPressUpdate(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "white",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "12px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#007BFF" }}>
                        עדכון פרטים
                    </Typography>
                    <TextField fullWidth type="text" name="name"  placeholder="שם" value={formData.name} onChange={handleValueChange} variant="outlined" margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField fullWidth type="text" name="phone"  placeholder="טלפון" value={formData.phone} onChange={handleValueChange} variant="outlined" margin="normal"
                     InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon color="primary" />
                            </InputAdornment>
                        ),
                    }} />
                    <TextField
                        fullWidth
                        type="email"
                        name="email"
                        placeholder="אימייל"
                        onChange={handleValueChange}
                        variant="outlined"
                        margin="normal"
                        value={formData.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
   <TextField fullWidth type="text" name="address"  placeholder="כתובת" value={formData.address}  onChange={handleValueChange} variant="outlined" margin="normal" InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon color="primary" />
                            </InputAdornment>
                        ),
                    }} />
                    <TextField fullWidth type="text" name="previousFamily" placeholder="משפחה מהבית" value={formData.previousFamily}  onChange={ handleValueChange} variant="outlined" margin="normal" InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleIcon color="primary" />
                            </InputAdornment>
                        ),
                    }} />
                    <TextField
                        fullWidth
                        type="password"
                        name="password"
                        placeholder="סיסמה (השאר ריק אם אין ברצונך לשנות)"
                        onChange={handleValueChange}
                        value={formData.password}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                mt: 2,
                                width: "100%",
                                background: "linear-gradient(135deg, #007BFF, #00C6FF)",
                                color: "white",
                                borderRadius: "20px",
                                p: "10px",
                                fontWeight: "bold",
                                "&:hover": { background: "#007BFF" },
                            }}
                        >
                            אישור
                        </Button>
                    </motion.div>
                </Box>
            </Modal>
        </>
    )
}
export default Update
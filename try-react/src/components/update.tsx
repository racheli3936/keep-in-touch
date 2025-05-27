import { FormEvent, useContext, useState } from "react";
import { User, UserContext } from "../types/types";
import axios from "axios";
import { Box, Modal, Typography, Fade} from "@mui/material";
import { motion } from "framer-motion";
import CustomTextField from '../styleComponent/customInput';
import { SubmitButton, RegisterLoginPaper } from '../styleComponent/loginRegisterButton';
import { successAlert } from "../utils/usefulFunctions";

const Update = () => {
    const [pressUpdate, setPressUpdate] = useState(true);
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
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('https://localhost:7191/api/User', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const newUser: User = {
                id:response.data.id,
                files: [],
                userGroups: [],
                name: formData.name || '',
                phone: formData.phone || '',
                email: formData.email || '',
                address: formData.address || '',
                previousFamily: formData.previousFamily || ''
            };
            setUser(newUser);
            setPressUpdate(false);
            successAlert('עדכנת בהצלחה!');
        } catch (error:any) {
            console.error('Failed to update user', error.response);
        }
    };

    return (
        <>
            <Modal
                open={pressUpdate}
                onClose={() => setPressUpdate(false)}
                closeAfterTransition
            >
                <Fade in={pressUpdate}>
                    <RegisterLoginPaper elevation={10}>
                        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: "#007BFF", mb: 1 }}>
                                עדכון פרטים
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
                            <CustomTextField type="text" name="name" label="שם" value={formData.name} onChange={handleValueChange} required />
                            <CustomTextField type="text" name="phone" label="טלפון" value={formData.phone} onChange={handleValueChange} required />
                            <CustomTextField type="email" name="email" label="אימייל" value={formData.email} onChange={handleValueChange} required />
                            <CustomTextField type="text" name="address" label="כתובת" value={formData.address} onChange={handleValueChange} required />
                            <CustomTextField type="text" name="previousFamily" label="משפחה מהבית" value={formData.previousFamily} onChange={handleValueChange} />
                            <CustomTextField
                                type="password"
                                name="password"
                                label="סיסמה (השאר ריק אם אין ברצונך לשנות)"
                                value={formData.password}
                                onChange={handleValueChange}
                            />
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <SubmitButton type="submit" variant="contained" fullWidth>
                                    אישור
                                </SubmitButton>
                            </motion.div>
                        </form>
                    </RegisterLoginPaper>
                </Fade>
            </Modal>
        </>
    );
};

export default Update;

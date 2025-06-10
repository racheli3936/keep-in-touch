import { Box, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';
import FileUploaderModal from './fileUploader'; // Import the FileUploaderModal component

const Events = () => {
    const { name, id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);

    const currentTabIndex = 0;

    const handleOpenModal = (event:any) => {
        event.preventDefault(); 
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleUploadSuccess = () => {
        // Optional: You could refresh events here if needed
        console.log("Upload completed successfully");
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Tabs 
                    value={currentTabIndex}
                    sx={{ justifyContent: 'flex-start', display: 'flex' }}>
                    <Tab label="אירועים" component={Link} to={`/showGroup/${name}/${id}/events`} />
                    <Tab label="העלאת קובץ" onClick={handleOpenModal} />
                </Tabs>
                <Outlet />
            </Box>

            <FileUploaderModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
};

export default Events;

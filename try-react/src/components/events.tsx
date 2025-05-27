// import { Box, Tab, Tabs } from '@mui/material';
// import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

// const Events = () => {
//     const { name, id } = useParams();
//     const location = useLocation();

//     // חישוב האינדקס הנוכחי
//     const currentPath = location.pathname;
//     const isFileUploader = currentPath.includes('/events/fileUploader');
//     const currentTabIndex = isFileUploader ? 1 : 0; // 0 לאירועים, 1 להעלאת קובץ

//     return (
//         <>
//          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//             <Tabs 
//                 value={currentTabIndex}
//                 sx={{ justifyContent: 'flex-start', display: 'flex' }} // מרכז את ה-Tabs
//             >
//                 <Tab label="אירועים" component={Link} to={`/showGroup/${name}/${id}/events`} />
//                 <Tab label="העלאת קובץ" component={Link} to={`/showGroup/${name}/${id}/events/fileUploader`} />
//             </Tabs>
//             <Outlet />
//         </Box>
//         </>
//     );
// };

// export default Events;
import { Box, Tab, Tabs } from '@mui/material';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';
import FileUploaderModal from './fileUploader'; // Import the FileUploaderModal component

const Events = () => {
    const { name, id } = useParams();
    const [modalOpen, setModalOpen] = useState(false);

    // חישוב האינדקס הנוכחי - עכשיו תמיד 0 כי אנחנו לא מנווטים יותר
    const currentTabIndex = 0;

    // Function to handle opening the modal
    const handleOpenModal = (event:any) => {
        event.preventDefault(); // Prevent default navigation
        setModalOpen(true);
    };

    // Function to handle modal close
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Function to handle successful upload
    const handleUploadSuccess = () => {
        // Optional: You could refresh events here if needed
        console.log("Upload completed successfully");
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Tabs 
                    value={currentTabIndex}
                    sx={{ justifyContent: 'flex-start', display: 'flex' }}
                >
                    <Tab label="אירועים" component={Link} to={`/showGroup/${name}/${id}/events`} />
                    {/* Use onClick instead of "to" prop to open modal instead of navigating */}
                    <Tab label="העלאת קובץ" onClick={handleOpenModal} />
                </Tabs>
                <Outlet />
            </Box>

            {/* Render FileUploaderModal */}
            <FileUploaderModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
};

export default Events;

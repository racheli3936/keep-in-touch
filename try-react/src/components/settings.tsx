// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useTheme } from '@mui/material';

// const Settings = ({ open, onClose }:{open:boolean,onClose:any}) => {
//   const theme = useTheme();

//   const handleSaveSettings = () => {
//     onClose();
//   };

//   return (
//     <Dialog 
//       open={open} 
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           minWidth: { xs: '300px', sm: '360px' },
//           overflow: 'visible',
//           boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
//           background: theme.palette.background.paper,
//         }
//       }}
//     >
//       <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
//         הגדרות
//       </DialogTitle>
//      <DialogContent>
//   <TextField
//     autoFocus
//     margin="dense"
//     label="שנה סיסמה"
//     type="password"
//     fullWidth
//     variant="outlined"
//     sx={{ mb: 2 }}
//   />
//   <TextField
//     margin="dense"
//     label="הגדרות פרטיות"
//     type="text"
//     fullWidth
//     variant="outlined"
//   />
//   <TextField
//     margin="dense"
//     label="בחר נושא"
//     type="text"
//     fullWidth
//     variant="outlined"
//     select
//     SelectProps={{
//       native: true,
//     }}
//     sx={{ mb: 2 }}
//   >
//     <option value="light">בהיר</option>
//     <option value="dark">כהה</option>
//   </TextField>
//   <TextField
//     margin="dense"
//     label="שפה"
//     type="text"
//     fullWidth
//     variant="outlined"
//     select
//     SelectProps={{
//       native: true,
//     }}
//     sx={{ mb: 2 }}
//   >
//     <option value="hebrew">עברית</option>
//     <option value="english">אנגלית</option>
//   </TextField>
//   <TextField
//   margin="dense"
//   label="הגדרות התראות"
//   type="text"
//   fullWidth
//   variant="outlined"
//   select
//   SelectProps={{
//     native: true,
//   }}
//   sx={{ mb: 2 }}
// >
//   <option value="email">מייל</option>
//   <option value="sms">SMS</option>
//   <option value="none">אין התראות</option>
// </TextField>

// <TextField
//   margin="dense"
//   label="שם משתמש"
//   type="text"
//   fullWidth
//   variant="outlined"
//   sx={{ mb: 2 }}
// />
// <TextField
//   margin="dense"
//   label="אימות דו-שלבי"
//   type="checkbox"
//   fullWidth
//   variant="outlined"
//   sx={{ mb: 2 }}
// />

// </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="outlined">
//           סגור
//         </Button>
//         <Button onClick={handleSaveSettings} variant="contained" color="primary">
//           שמור
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default Settings;
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useTheme } from '@mui/material';

const Settings = ({ open, onClose }:{open:boolean,onClose:any}) => {
  const theme = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('light'); // מצב נושא
  const [selectedLanguage, setSelectedLanguage] = useState('hebrew'); // מצב שפה
  const [selectedNotification, setSelectedNotification] = useState('email'); // מצב התראות

  const handleThemeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTheme(event.target.value as string);
  };

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedLanguage(event.target.value as string);
  };

  const handleNotificationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedNotification(event.target.value as string);
  };

  const handleSaveSettings = () => {
    // כאן תוכל להוסיף לוגיקה לשמירת ההגדרות
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: { xs: '300px', sm: '360px' },
          overflow: 'visible',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          background: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        הגדרות
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="שנה סיסמה"
          type="password"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="הגדרות פרטיות"
          type="text"
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="בחר נושא"
          type="text"
          fullWidth
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
          value={selectedTheme} // קישור מצב הנושא לשדה
          onChange={handleThemeChange} // עדכון הנושא
          sx={{ mb: 2 }}
        >
          <option value="light">בהיר</option>
          <option value="dark">כהה</option>
        </TextField>
        <TextField
          margin="dense"
          label="שפה"
          type="text"
          fullWidth
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
          value={selectedLanguage} // קישור מצב השפה לשדה
          onChange={handleLanguageChange} // עדכון השפה
          sx={{ mb: 2 }}
        >
          <option value="hebrew">עברית</option>
          <option value="english">אנגלית</option>
        </TextField>
        <TextField
          margin="dense"
          label="הגדרות התראות"
          type="text"
          fullWidth
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
          value={selectedNotification} // קישור מצב ההתראות לשדה
          onChange={handleNotificationChange} // עדכון ההתראות
          sx={{ mb: 2 }}
        >
          <option value="email">מייל</option>
          <option value="sms">SMS</option>
          <option value="none">אין התראות</option>
        </TextField>
        <TextField
          margin="dense"
          label="שם משתמש"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="אימות דו-שלבי"
          type="checkbox"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          סגור
        </Button>
        <Button onClick={handleSaveSettings} variant="contained" color="primary">
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, useTheme } from '@mui/material';

const Settings = ({ open, onClose }:{open:boolean,onClose:any}) => {
  const theme = useTheme();

  const handleSaveSettings = () => {
    console.log("Settings saved");
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
        {/* הוספת שדות נוספים לפי הצורך */}
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

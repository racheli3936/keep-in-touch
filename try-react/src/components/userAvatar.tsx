import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../types/types';
import { Avatar, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, Paper, Divider,
  List, useTheme, Tooltip, Badge, styled} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import StyledBadge from '../styleComponent/styleBaget';
import { UserInfo, UserMenuItem } from '../styleComponent/userInfo';
import { RegisterLoginButton } from '../styleComponent/loginRegisterButton';
import Settings from './settings';

const HiddenInput = styled('input')({
  display: 'none',
});

const UserAvatar = () => {
  const theme = useTheme();
  const context = useContext(UserContext);
  const { user } = context;
  const [image, setImage] = useState<string|null|ArrayBuffer>('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  // File upload handler
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string | undefined) => {
    if (!name || name.trim() === '') return 'U';

    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateProfile = () => {
    handleClose();
    navigate('update');
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    handleClose();
    setRefresh(!refresh)
    navigate('/');
    window.location.reload()

  };

  return (
    <>
      <Tooltip title="פרופיל משתמש" arrow>
        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
          <Avatar
            alt={user?.name}
            src={typeof image === 'string' ? image : undefined}
            onClick={handleClickOpen}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              bgcolor: image ? 'transparent' : '#FF5722',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            {!image && getInitials(user?.name)}
          </Avatar>
        </StyledBadge>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: { xs: '300px', sm: '360px' },
            overflow: 'visible',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5F5 100%)',
          }
        }}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <DialogTitle sx={{ textAlign: 'center',pb: 1, fontWeight: 'bold', 
           borderBottom: '1px solid rgba(0, 0, 0, 0.1)',  color: theme.palette.primary.main, direction: 'rtl'}}>
          פרטי משתמש
        </DialogTitle>

        <DialogContent sx={{ pt: 4, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, position: 'relative' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <label htmlFor="icon-button-file">
                  <HiddenInput
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <Paper
                    elevation={3}
                    component="span"
                    sx={{
                      p: 0.7,
                      borderRadius: '50%',
                      bgcolor: theme.palette.secondary.main,
                      color: 'white',
                      display: 'flex',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark,
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </Paper>
                </label>
              }
            >
              <Avatar
                alt={user?.name}
                src={typeof image === 'string' ? image : undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: image ? 'transparent' : theme.palette.secondary.main,
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                  border: '3px solid white',
                }}
              >
                {!image && getInitials(user?.name)}
              </Avatar>
            </Badge>

            {user && <UserInfo user={user} />} {/* שימוש ברכיב UserInfo */}
          </Box>
          <Divider sx={{ mb: 2, opacity: 0.7 }} />

          <List sx={{
            p: 0, '& .MuiListItem-root': {
              transition: 'all 0.2s ease', borderRadius: 2,
              mb: 0.5, '&:hover': { bgcolor: 'rgba(98, 0, 234, 0.08)', transform: 'translateX(-4px)', }
            }, direction: 'rtl'
          }}>
            <UserMenuItem icon={<EditIcon sx={{ color: theme.palette.primary.main }} />} text="עדכון פרטים" onClick={handleUpdateProfile} />
            <UserMenuItem icon={<SettingsIcon sx={{ color: theme.palette.primary.main }} />} text="הגדרות" onClick={handleOpenSettings} />
            <Settings open={settingsOpen} onClose={handleCloseSettings} />
            <UserMenuItem icon={<ExitToAppIcon sx={{ color: theme.palette.error.main }} />} text="התנתק" onClick={handleLogout} />
          </List>
        </DialogContent>

        <DialogActions sx={{
          padding: theme.spacing(2, 3, 3),
          justifyContent: 'center'
        }}>
          {/* <RegisterLoginButton /> */}
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 3,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                bgcolor: 'rgba(255, 87, 34, 0.08)',
              }
            }}>
            סגור
          </Button>
          <RegisterLoginButton onClick={handleUpdateProfile}>
            עדכון פרטים
          </RegisterLoginButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAvatar;

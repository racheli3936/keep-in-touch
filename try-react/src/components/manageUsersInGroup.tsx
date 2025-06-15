import axios from 'axios';
import { useState } from 'react';
import Modal from 'react-modal';
import GroupStore from '../stores/GroupStore';
import { errorAlert, extractIdFromToken, getUserById, sendEmail, successAlert } from '../utils/usefulFunctions';
import { EmailRequest } from '../types/types';
import {
  Button, TextField, DialogActions, DialogContentText, Box, Typography, Tooltip,
  IconButton, Paper, Fade, CircularProgress, Card, CardContent, Divider, Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';

Modal.setAppElement('#root');

const GroupManagement = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonHover, setButtonHover] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = checkUserIsAdmin();

  const openModal = (actionType: string) => {
    setAction(actionType);
    setModalIsOpen(true);
    setEmail('');
    setConfirmDelete(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setAction(null);
    setConfirmDelete(false);
  };

  const handleManageClick = () => {
    setShowManagementPanel(!showManagementPanel);
  };

  const generateRandomPassword = (length = 8) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    // Shuffle the password characters
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const handleDeleteGroup = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`https://keepintouch.onrender.com/api/Group/${GroupStore.currentGroup.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await successAlert('הקבוצה נמחקה בהצלחה');
      closeModal();
      // כאן ניתן להוסיף ניתוב חזרה לדף הבית או רשימת הקבוצות
    } catch (error: any) {
      console.error('Error deleting group:', error);
      if (error.response && error.response.status === 403) {
        errorAlert('אין לך הרשאה למחוק את הקבוצה');
      } else {
        errorAlert('שגיאה במחיקת הקבוצה');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (action === 'delete') {
      await handleDeleteGroup();
      return;
    }

    setLoading(true);

    if (action === 'add') {
      let tokenForUserToAdd = "";
      const token = localStorage.getItem('token');

      try {
        // Check if user already exists in the system
        try {
          const response = await axios.get(`https://keepintouch.onrender.com/api/User/email/${email}`);
          tokenForUserToAdd = response.data.token;
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            // If user doesn't exist, register them
            const password = generateRandomPassword();
            const loginData = {
              name: '',
              phone: '',
              email: email,
              address: '',
              previousFamily: '',
              password: password,
            };

            try {
              const responseRegister = await axios.post('https://keepintouch.onrender.com/api/Auth/register', loginData);
              tokenForUserToAdd = responseRegister.data.token;
              const emailData: EmailRequest = {
                to: email,
                subject: 'סיסמא לKeepInTouch',
                body: `
                  <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: #f8f9fa;">
                    <div style="background-color: #4a69bd; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
                    <img src="../assets/logo_fix.png" alt="לוגו" style="max-width: 100px; margin-bottom: 10px;" />
                    <h1>ברוך הבא ל-KeepInTouch</h1>
                    </div>
                    <div style="padding: 20px;">
                      <h2>הצטרפת בהצלחה!</h2>
                      <p>הוזמנת להצטרף לקבוצה: <strong>${GroupStore.currentGroup.name}</strong></p>
                      <p>להלן פרטי הכניסה שלך:</p>
                      <div style="background-color: #f1f2f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>שם משתמש:</strong> ${email}</p>
                        <p><strong>סיסמה:</strong> ${password}</p>
                      </div>
                      <p>אנא שמור על פרטי הכניסה שלך באופן מאובטח.</p>
                    </div>
                    <div style="background-color: #f1f2f6; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
                      <p>הודעה זו נשלחה באופן אוטומטי, אין להשיב לה.</p>
                    </div>
                  </div>
                `
              };

              sendEmail(emailData);
              await successAlert(`המשתמש נרשם בהצלחה וסיסמה נשלחה למייל ${email}`, 5000);
            } catch (error) {
              console.error('add user to group by register failed:', error);
              errorAlert('שגיאה ברישום המשתמש');
            }
          } else {
            console.error("get user by email failed:", error);
            errorAlert('שגיאה בקבלת פרטי המשתמש');
          }
        }

        try {
          // Add user to group
          await axios.post(
            'https://keepintouch.onrender.com/api/Group/addUser',
            {
              groupId: GroupStore.currentGroup.id,
              userToken: tokenForUserToAdd
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setModalIsOpen(false)
          await successAlert(`המשתמש ${email} נוסף בהצלחה לקבוצה`);
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            errorAlert('המשתמש כבר קיים בקבוצה');
          } else {
            errorAlert('שגיאה בהוספת המשתמש לקבוצה');
          }
          console.error('Error adding user to group:', error);
        }
      } catch (error) {
        console.error("something in login failed:", error);
        errorAlert('שגיאה בתהליך ההוספה');
      }
    } else if (action === 'remove') {
      try {
        await axios.delete(`https://keepintouch.onrender.com/api/User/remove-from-group`, {
          params: {
            email: email,
            groupId: GroupStore.currentGroup.id
          }
        });

        successAlert(`המשתמש ${email} הוסר בהצלחה מהקבוצה`);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          errorAlert("המשתמש שניסית להסיר לא נמצא בקבוצה");
        } else {
          errorAlert('שגיאה בהסרת המשתמש מהקבוצה');
        }
      }
    }
    setLoading(false);
    closeModal();
  };

  function checkUserIsAdmin() {
    const currentUserId = extractIdFromToken(localStorage.getItem('token')!);
    const groupAdminId = GroupStore.currentGroup.adminId;
    return groupAdminId === Number(currentUserId);
  }

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 1300,
    },
    content: {
      top: '50%', left: '50%', right: 'auto', bottom: 'auto',
      marginRight: '-50%', transform: 'translate(-50%, -50%)', padding: 0,
      borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      maxWidth: '500px', width: '90%',
    }
  };

  const getModalColor = () => {
    switch (action) {
      case 'add': return 'success.main';
      case 'remove': return 'error.main';
      case 'delete': return 'error.main';
      default: return 'primary.main';
    }
  };

  const getModalIcon = () => {
    switch (action) {
      case 'add': return <PersonAddIcon />;
      case 'remove': return <PersonRemoveIcon />;
      case 'delete': return <DeleteIcon />;
      default: return <GroupIcon />;
    }
  };

  const getModalTitle = () => {
    switch (action) {
      case 'add': return 'הוספת משתמש לקבוצה';
      case 'remove': return 'הסרת משתמש מהקבוצה';
      case 'delete': return 'מחיקת קבוצה';
      default: return '';
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ניהול קבוצה
          </Typography>

        </Box>
        <Typography variant="caption" color="text.secondary" >
          {getUserById(GroupStore.currentGroup.adminId)?.name}- {getUserById(GroupStore.currentGroup.adminId)?.phone} :מזהה מנהל
        </Typography>

        <Tooltip title={isAdmin ? "ניהול קבוצה" : "אפשר לפנות למנהל, רק מנהל קבוצה יכול לנהל את הקבוצה"}>
          <span>
            <Button
              variant="contained"
              startIcon={<ManageAccountsIcon />}
              onClick={handleManageClick}
              disabled={!isAdmin}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1.5,
                backgroundColor: isAdmin ? 'primary.main' : 'grey.400',
                '&:hover': { backgroundColor: isAdmin ? 'primary.dark' : 'grey.500' },
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
            >
              {showManagementPanel ? 'סגור פאנל ניהול' : 'פתח פאנל ניהול'}
            </Button>
          </span>
        </Tooltip>

        <Fade in={showManagementPanel}>
          <Box sx={{ display: showManagementPanel ? 'block' : 'none' }}>
            <Divider sx={{ my: 2 }} />

            {/* ניהול חברי קבוצה */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                ניהול חברי קבוצה
              </Typography>

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PersonAddIcon />}
                  onClick={() => openModal('add')}
                  onMouseEnter={() => setButtonHover('add')}
                  onMouseLeave={() => setButtonHover(null)}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    transform: buttonHover === 'add' ? 'translateY(-2px)' : 'none',
                    boxShadow: buttonHover === 'add' ? 4 : 2,
                    minWidth: 140
                  }}
                >
                  הוסף משתמש
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PersonRemoveIcon />}
                  onClick={() => openModal('remove')}
                  onMouseEnter={() => setButtonHover('remove')}
                  onMouseLeave={() => setButtonHover(null)}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    transform: buttonHover === 'remove' ? 'translateY(-2px)' : 'none',
                    boxShadow: buttonHover === 'remove' ? 4 : 2,
                    minWidth: 140
                  }}
                >
                  הסר משתמש
                </Button>
              </Box>
            </Paper>

            {/* מחיקת קבוצה */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'error.light',
                border: '2px solid',
                borderColor: 'error.main'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                אזור מסוכן
              </Typography>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  מחיקת הקבוצה תמחק את כל הנתונים הקשורים אליה ולא ניתן יהיה לשחזר אותם!
                </Typography>
              </Alert>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => openModal('delete')}
                onMouseEnter={() => setButtonHover('delete')}
                onMouseLeave={() => setButtonHover(null)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  transform: buttonHover === 'delete' ? 'translateY(-2px)' : 'none',
                  boxShadow: buttonHover === 'delete' ? 4 : 2,
                  fontWeight: 'bold'
                }}
              >
                מחק קבוצה
              </Button>
            </Paper>
          </Box>
        </Fade>
      </CardContent>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={getModalTitle()}
      >
        <Box sx={{ bgcolor: getModalColor(), p: 2, color: 'white', borderRadius: '8px 8px 0 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getModalIcon()}
              {getModalTitle()}
            </Typography>
            <IconButton size="small" onClick={closeModal} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          {action === 'delete' ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'error.main' }}>
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  אזהרה!
                </Typography>
              </Box>

              <DialogContentText sx={{ mb: 2, direction: 'rtl', color: 'text.primary' }}>
                האם אתה בטוח שברצונך למחוק את הקבוצה "{GroupStore.currentGroup.name}"?
                <br />
                <strong>פעולה זו בלתי הפיכה ותמחק את כל הנתונים הקשורים לקבוצה!</strong>
              </DialogContentText>

              {!confirmDelete && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  לחץ על "מחק קבוצה" שוב כדי לאשר את המחיקה
                </Alert>
              )}
            </>
          ) : (
            <>
              <DialogContentText sx={{ mb: 2, direction: 'rtl' }}>
                {action === 'add'
                  ? 'הזן את כתובת האימייל של המשתמש שברצונך להוסיף לקבוצה. אם המשתמש אינו קיים במערכת, הוא יירשם אוטומטית וסיסמה תישלח לכתובת האימייל שלו.'
                  : 'הזן את כתובת האימייל של המשתמש שברצונך להסיר מהקבוצה.'}
              </DialogContentText>

              <TextField
                autoFocus
                fullWidth
                required
                type="email"
                label="כתובת אימייל"
                dir="rtl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{ mb: 3 }}
              />

              {action === 'add' && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'info.light',
                  color: 'info.contrastText',
                  p: 1.5,
                  borderRadius: 1,
                  mb: 2
                }}>
                  <LockIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    סיסמה חזקה תיווצר אוטומטית ותישלח לכתובת האימייל שהוזנה
                  </Typography>
                </Box>
              )}
            </>
          )}

          <DialogActions sx={{ pt: 2, pb: 1, px: 0, justifyContent: 'space-between' }}>
            <Button
              onClick={closeModal}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={action === 'add' ? 'success' : 'error'}
              disabled={loading || (action !== 'delete' && !email)}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                action === 'add' ? 'הוסף משתמש' :
                  action === 'remove' ? 'הסר משתמש' :
                    confirmDelete ? 'מחק קבוצה סופית' : 'מחק קבוצה'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Modal>
    </Card>
  );
};

export default GroupManagement;
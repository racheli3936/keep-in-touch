import { useContext, useState } from 'react';
import { EmailRequest, UserContext } from '../types/types';
import { sendEmail } from '../utils/usefulFunctions';
import { Paper, TextField, Button, Typography, Box, Alert, Fade, CircularProgress, Avatar, Modal } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';

const EmailSender = ({ to, isOpen, onClose }: { to: string; isOpen: boolean; onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void }) => {
  const [body, setBody] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const context = useContext(UserContext);
  const { user } = context;

  const sendYourEmail = async () => {
    if (!body.trim()) {
      setResponseMessage('אנא הכנס תוכן להודעה');
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    setSuccess(false);
    const emailRequest: EmailRequest = {
      to: to,
      subject: `נשלח לך הודעה מKeepInTouch מאת: ${user?.email}`,
      body: `<div style="direction: rtl; font-size: 25px;">${body}</div>`
    };

    try {
      await sendEmail(emailRequest);
      setResponseMessage('ההודעה נשלחה בהצלחה!');
      setSuccess(true);
      setBody('');

    } catch (error: any) {
      if (error.response) {
        setResponseMessage(`שגיאה: ${error.response.data}`);
      } else {
        setResponseMessage(`אירעה שגיאה: ${error.message}`);
      }
      setError(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        onClose({}, "escapeKeyDown");
      }, 1000)

    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Fade in={isOpen} timeout={600} >

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)', mb: 3,
            position: 'relative', margin: 'auto', maxWidth: 500, top: '50%', transform: 'translateY(-50%)', padding: 3
          }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: '#6200EA', mr: 2 }}> <MailOutlineIcon /> </Avatar>
            <Typography variant="h5">שליחת הודעה</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">אל: {to}</Typography>
          <TextField multiline rows={6} fullWidth placeholder="תוכן ההודעה" variant="outlined" value={body} onChange={(e) => setBody(e.target.value)} sx={{ mb: 3 }} />
          {(success || error) && (
            <Fade in={!!(success || error)} timeout={500}>
              <Alert severity={success ? 'success' : 'error'} variant="filled" sx={{ mb: 3 }}
                onClose={() => {
                  setSuccess(false);
                  setError(false);
                  setResponseMessage('');

                }} >
                {responseMessage}
              </Alert>
            </Fade>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={sendYourEmail}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}>
              {loading ? 'שולח...' : 'שלח הודעה'}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default EmailSender;

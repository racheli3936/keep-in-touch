import axios from "axios";
import { useState, useEffect, useRef } from "react";
import EventsStore from "../stores/EventsStore";
import { Box, TextField, IconButton, Typography, Paper, CircularProgress, Avatar, Container} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface ChatEntry {
  q: string;
  a: string;
}
const Chat = () => {
  const [question, setQuestion] = useState("");
  const [groupContent, setGroupContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await EventsStore.getEvevntByGroupId();
        setGroupContent(EventsStore.Eventlist.map(event => event.content));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const currentQuestion = question;
    setQuestion(""); // clear input

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://keepintouch.onrender.com/api/Chat', {
        Prompt: `המידע הבא לקוח מקבצים של קבוצה' :\n${groupContent}\nענה אך ורק על סמך מידע זה.`,
        Question: currentQuestion,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const content = response.data.choices?.[0]?.message?.content;
      const answerText = content || "אין לי תשובה לשאלה זו על סמך המידע שבקבוצה.";

      setChat((prev) => [...prev, { q: currentQuestion, a: answerText }]);
    } catch (error) {
      console.error(error);
      setChat((prev) => [
        ...prev,
        { q: currentQuestion, a: "שגיאה בשליחת שאלה לשרת." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <Container maxWidth='lg' sx={{ height: "100vh", p: 0 }}>
      <Box 
        sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.default", borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
        {/* Chat header */}
        <Box sx={{p: 2, borderBottom: "1px solid",  borderColor: "divider", bgcolor: "background.paper", display: "flex", alignItems: "center"}}>
          <SmartToyIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" fontWeight="500">AI Assistant</Typography>
        </Box>

        {/* Chat messages area */}
        <Box
          ref={chatContainerRef}
          sx={{flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2, bgcolor: "#f5f5f5" }}>
          {chat.length === 0 && (
            <Box sx={{ display: "flex",  justifyContent: "center", alignItems: "center",  height: "100%", opacity: 0.7 }} >
              <Typography variant="body1" textAlign="center" color="text.secondary">
                שאל שאלה על סמך המידע בקבוצה
              </Typography>
            </Box>
          )}

          {chat.map((entry, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              {/* User message */}
              <Box 
                sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, mr: 1,  mt: 0.5 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Paper 
                  elevation={0}
                  sx={{p: 2, bgcolor: "primary.light", color: "primary.contrastText", borderRadius: 2, maxWidth: "80%" }}>
                  <Typography variant="body1">{entry.q}</Typography>
                </Paper>
              </Box>

              {/* Bot message */}
              <Box sx={{ display: "flex", alignItems: "flex-start", ml: 2}}>
                <Avatar sx={{ bgcolor: "#10a37f", width: 36, height: 36, mr: 1,  mt: 0.5}}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Paper elevation={0} sx={{ p: 2,  bgcolor: "background.paper",  borderRadius: 2,maxWidth: "80%"}}>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {entry.a}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{display: "flex",alignItems: "center", ml: 2, mb: 2 }}>
              <Avatar 
                sx={{bgcolor: "#10a37f", width: 36,  height: 36, mr: 1 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <CircularProgress size={24} sx={{ ml: 2 }} />
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>
        {/* Input area */}
        <Box 
          sx={{ p: 2, bgcolor: "background.paper", borderTop: "1px solid",  borderColor: "divider" }}>
          <Paper
            elevation={1}
            sx={{ display: "flex", alignItems: "flex-end", p: "8px 16px" ,borderRadius: 4 }} >
            <TextField
              fullWidth
              placeholder="שאל שאלה..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              variant="standard"
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "16px" }
              }}
            />
            <IconButton 
              onClick={handleSend} 
              disabled={loading || !question.trim()} 
              color="primary"
              sx={{ 
                ml: 1,
                bgcolor: question.trim() ? "primary.main" : "transparent",
                color: question.trim() ? "white" : "text.disabled",
                '&:hover': {
                  bgcolor: question.trim() ? "primary.dark" : "transparent",}}} >
              {loading ? (<CircularProgress size={24} color="inherit" />) : (<SendIcon />)}
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Chat;
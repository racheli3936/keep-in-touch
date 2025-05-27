import { useEffect, useState } from 'react';
import { Massage } from '../types/types';
import { observer } from 'mobx-react-lite';
import { Box, TextField, Button, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Avatar, Paper, Tooltip, InputAdornment, Popover, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import messageStore from '../stores/MassageStore';
import GroupStore from '../stores/GroupStore';
import { errorAlert, extractIdFromToken } from '../utils/usefulFunctions';
import UserStore from '../stores/UserStore';

// אימוג'ים נפוצים
const commonEmojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
    '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '😗',
    '👍', '👎', '❤️', '🔥', '👏', '😢', '😭', '😡',
    '🥳', '🎉', '🎂', '🎁', '🙏', '👋', '💯', '🤔'
];

const Messages = observer(() => {
    const [inputValue, setInputValue] = useState('');
    const [fontSize, setFontSize] = useState('16px');
    const [color, setColor] = useState('#000000');
    const [showFormatting, setShowFormatting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<Number | undefined>();


    // לפופאפ של האימוג'י
    const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
    const openEmojiPicker = Boolean(emojiAnchorEl);

    useEffect(() => {
        messageStore.fetchMessages();

        const token = localStorage.getItem('token');
        if (token) {
            const userId = Number(extractIdFromToken(token));
            setCurrentUserId(userId);
        }
    }, []);

    const addMessage = async () => {
        if (inputValue.trim() !== '') {
            const massage: Partial<Massage> = {
                content: inputValue,
                groupId: GroupStore.currentGroup.id,
                fontSize: fontSize,
                color: color
            };
            await messageStore.addMessage(massage);
            await messageStore.fetchMessages();
            setInputValue('');
            setShowFormatting(false);
        }
    };

    const deleteMessage = async (messageId: number, userId: number) => {
        console.log(userId,'userId');
        console.log(currentUserId,'currentUserId');
        
        if (userId != currentUserId) {
            errorAlert("אין לך הרשאות למחוק הודעה זו");
        } else {
            await messageStore.deleteMessage(messageId);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addMessage();
        }
    };

    // פתיחת בוחר האימוג'י
    const handleEmojiClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setEmojiAnchorEl(event.currentTarget);
    };

    // סגירת בוחר האימוג'י
    const handleEmojiClose = () => {
        setEmojiAnchorEl(null);
    };

    // הוספת אימוג'י לטקסט
    const addEmoji = (emoji: string) => {
        setInputValue(inputValue + emoji);
        handleEmojiClose();
    };

    // שם משתמש מקוצר להצגה באווטאר
    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // צבע רקע אקראי לאווטאר לפי userId
    const getAvatarColor = (userId: number) => {
        const colors = ['#E67C73', '#F6BF26', '#33B679', '#8E24AA', '#039BE5', '#4285F4', '#D81B60', '#0B8043', '#7986CB'];
        return colors[userId % colors.length];
    };

    // פונקציה להמרת תאריך לפורמט מתאים
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    // האם ההודעה נשלחה על ידי המשתמש הנוכחי
    const isCurrentUser = (userId: number) => {
        return userId == currentUserId;
    };

    // קיבוץ הודעות לפי שולח עם הפרדה על פי זמן
    type MessageGroup = {
        userId: number;
        userName: string;
        messages: Massage[];
        isCurrentUser: boolean;
    };

    // פונקציה לקיבוץ הודעות
    const groupMessagesBySender = () => {
        const groups: MessageGroup[] = [];
        let currentGroup: MessageGroup | null = null;

        // מיון ההודעות לפי זמן - מהישנות לחדשות
        const sortedMessages = [...messageStore.groupMessages].sort((a, b) =>
            new Date(a.createdDate || 0).getTime() - new Date(b.createdDate || 0).getTime()
        );

        sortedMessages.forEach(message => {
            console.log(currentGroup, "currentGroup");
            // אם אין קבוצה נוכחית או אם השולח שונה או אם עברו יותר מ-5 דקות
            const isSameUser = currentGroup && currentGroup.userId == message.userId;
            const timeDiff = currentGroup && message.createdDate && currentGroup.messages[currentGroup.messages.length - 1].createdDate
                ? new Date(message.createdDate).getTime() - new Date(currentGroup.messages[currentGroup.messages.length - 1].createdDate).getTime()
                : Infinity;

            if (!isSameUser || timeDiff > 5 * 60 * 1000) {
                console.log(message, "message");
                console.log(UserStore.Userslist, "usersLIst");
                // 5 דקות בין הודעות יוצר קבוצה חדשה
                currentGroup = {
                    userId: message.userId,
                    userName: UserStore.Userslist.find(u => u.id == message.userId)?.name || '',
                    messages: [message],
                    isCurrentUser: isCurrentUser(message.userId)
                };
                groups.push(currentGroup);
            } else if (currentGroup) {
                currentGroup.messages.push(message);
            }
        });

        return groups;
    };

    const messageGroups = groupMessagesBySender();
    console.log(messageGroups, 'messageGroup');


    return (
        <Box sx={{
            height: '100vh',
            width:'100%',
            display: 'flex',
          
            flexDirection: 'column',
            bgcolor: '#f8f9fa',
            fontFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
        }} dir="rtl">
            {/* Header */}
            <Box sx={{
                p: 1.5,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#ffffff'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#4285F4', width: 34, height: 34, mr: 1.5 }}>
                        {getInitials(GroupStore.currentGroup.name || 'צ')}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {GroupStore.currentGroup.name || 'צ׳אט קבוצתי'}
                    </Typography>
                </Box>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Box>

            {/* Message Area */}
            <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {messageGroups.map((group, groupIndex) => (

                    <Box
                        key={`group-${groupIndex}`}
                        sx={{
                            display: 'flex',
                            // המשתמש הנוכחי תמיד בצד ימין, אחרים בצד שמאל
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: group.isCurrentUser ? 'flex-end' : 'flex-start',
                            width: '100%'
                        }}>
                        {/* Avatar - רק עבור משתמשים אחרים, מופיע בצד ימין של ההודעה */}
                        {!group.isCurrentUser && (
                            <Avatar
                                sx={{
                                    mr: 1.5,
                                    bgcolor: getAvatarColor(group.userId),
                                    width: 36,
                                    height: 36
                                }}
                            >
                                {getInitials(group.userName)}
                            </Avatar>
                        )}

                        <Box sx={{
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: group.isCurrentUser ? 'flex-end' : 'flex-start',
                            gap: 0.5
                        }}>
                            {/* שם המשתמש - מוצג רק עבור משתמשים אחרים */}
                            {!group.isCurrentUser && (
                                <Typography variant="subtitle2" sx={{ fontWeight: 500, mr: 1 }}>
                                    {group.userName}
                                </Typography>
                            )}

                            {/* קבוצת ההודעות */}
                            {group.messages.map((message) => (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: group.isCurrentUser ? 'row' : 'row',
                                    }}>
                                    {/* כפתור מחיקה - מוצג רק עבור הודעות שלי */}

                                    {group.isCurrentUser && (
                                        <Tooltip title="מחק הודעה">
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteMessage(message.id, message.userId)}
                                                className="delete-button"
                                                sx={{mr: 0.5, color: '#5f6368', padding: '2px' }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {/* תוכן ההודעה */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: '18px',
                                            bgcolor: group.isCurrentUser ? '#e3f2fd' : '#ffffff',
                                            border: group.isCurrentUser ? 'none' : '1px solid #e0e0e0',
                                            maxWidth: '100%',
                                            position: 'relative',
                                            '&:hover .delete-button': {
                                                visibility: 'visible'
                                            }
                                        }}
                                    >
                                        <Typography sx={{
                                            fontSize: message.fontSize || '16px',
                                            color: message.color || '#202124',
                                            wordBreak: 'break-word',
                                            lineHeight: 1.4,
                                        }}>
                                            {message.content}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))}

                            {/* זמן ההודעה האחרונה בקבוצה */}
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#5f6368',
                                    alignSelf: group.isCurrentUser ? 'flex-start' : 'flex-end',
                                    mx: 1,
                                    fontSize: '11px'
                                }}
                            >
                                {group.messages[group.messages.length - 1].createdDate &&
                                    formatDate(group.messages[group.messages.length - 1].createdDate.toString())}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Formatting Options */}
            {showFormatting && (
                <Box sx={{
                    p: 1,
                    borderTop: '1px solid #e0e0e0',
                    bgcolor: '#ffffff',
                    display: 'flex',
                    gap: 2
                }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>גודל טקסט</InputLabel>
                        <Select
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            label="גודל טקסט"
                            size="small"
                        >
                            <MenuItem value="12px">קטן</MenuItem>
                            <MenuItem value="16px">רגיל</MenuItem>
                            <MenuItem value="20px">גדול</MenuItem>
                            <MenuItem value="24px">גדול מאוד</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ width: 120 }}>
                        <InputLabel>צבע טקסט</InputLabel>
                        <TextField
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            size="small"
                            label="צבע טקסט"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FormatColorTextIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </Box>
            )}

            {/* Message Input */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                bgcolor: '#ffffff',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#f8f9fa',
                    borderRadius: '24px',
                    p: '4px 16px',
                    border: '1px solid #dadce0'
                }}>
                    <TextField
                        placeholder="הקלד הודעה..."
                        fullWidth
                        multiline
                        maxRows={6}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '0.95rem',
                                py: 1
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {/* בוחר אימוג'י */}
                        <Tooltip title="הוסף אימוג'י">
                            <IconButton
                                size="small"
                                sx={{ color: '#5f6368' }}
                                onClick={handleEmojiClick}
                            >
                                <InsertEmoticonIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Popover
                            open={openEmojiPicker}
                            anchorEl={emojiAnchorEl}
                            onClose={handleEmojiClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Box sx={{ p: 2, maxWidth: 280 }}>
                                <Grid container spacing={1}>
                                    {commonEmojis.map((emoji, index) => (
                                        <Grid  key={index}>
                                            <Button
                                                onClick={() => addEmoji(emoji)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {emoji}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Popover>

                        <Tooltip title="אפשרויות עיצוב">
                            <IconButton
                                size="small"
                                onClick={() => setShowFormatting(!showFormatting)}
                                color={showFormatting ? "primary" : "default"}
                                sx={{ color: showFormatting ? '#4285F4' : '#5f6368' }}>
                                <FormatSizeIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="שלח">
                            <span>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={addMessage}
                                    disabled={!inputValue.trim()}
                                    sx={{
                                        color: inputValue.trim() ? '#4285F4' : '#5f6368',
                                        '&.Mui-disabled': {
                                            color: '#dadce0'
                                        }
                                    }}>
                                    <SendIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

export default Messages;

import { useEffect, useState } from "react";
import { ListItemIcon, Typography, Grid, Card, CardContent, CardActions, Button, Avatar, TextField, Box,
  InputAdornment, IconButton, Paper, Divider, CircularProgress, Menu, MenuItem } from "@mui/material";
import { Group as GroupIcon, Email as EmailIcon, Phone as PhoneIcon, Search as SearchIcon, LocationOn as LocationIcon, MoreVert as MoreVertIcon, PersonRemove as PersonRemoveIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react-lite";
import EmailSender from "./emailSender";
import { User } from "../types/types";

const GroupMembers = observer(() => {
  const { id, name } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [contextMember, setContextMember] = useState<User|null>(null);
  const [emailMember, setEmailMember] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleMenuOpen = (event:any, member:User) => {
    setMenuAnchorEl(event.currentTarget);
    setContextMember(member);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setContextMember(null);
  };

  // Email modal handling
  const openEmailModal = (email:any) => {
    setEmailMember(email);
    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  // Filter members based on search term
  const filteredMembers = UserStore.Userslist.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      (member.phone && member.phone.includes(searchTerm))
    );
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        await UserStore.getUsersForGroup(id || '');
      } catch (error: any) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Email Modal Component */}
      <EmailSender
        to={emailMember}
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
      />

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        mb: 4,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light' }}>
            <GroupIcon />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight="bold">
            חברי הקבוצה
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder="חיפוש לפי שם, אימייל או טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: { md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              dir: "rtl"
            }} />
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate(`/showGroup/${name}/${id}/manageUsers`)} >
            הוסף חבר
          </Button>
        </Box>
      </Box>
      {/* Members Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredMembers.length > 0 ? (
        <Grid container spacing={3}>
          {filteredMembers.map((member) => (
            <Grid size={{xs:12, sm:6, md:4}} key={member.name + member.phone}>
              <Card elevation={2} sx={{ borderRadius: 2, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ height: 80, background: 'linear-gradient(90deg, #3f51b5 0%, #7986cb 100%)' }} />
                  <Box sx={{ position: 'absolute', top: 3, right: 3 }}>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, member)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: -5 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', border: '4px solid white', fontSize: '2rem' }}>
                      {member.name?.charAt(0)}
                    </Avatar>
                  </Box>
                </Box>

                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography 
                        component="a" 
                        href={`mailto:${member.email}`}
                        variant="body2"
                        color="primary"
                        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {member.email}
                      </Typography>
                    </Box>
                    
                    {member.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography 
                          component="a" 
                          href={`tel:${member.phone}`}
                          variant="body2"
                          color="textSecondary"
                        >
                          {member.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {member.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {member.address}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>       
                <Divider />      
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button 
                    startIcon={<EmailIcon />} 
                    variant="outlined" 
                    size="small" 
                    onClick={() => openEmailModal(member.email)}  
                    fullWidth 
                    sx={{ mr: 1 }} 
                  >
                    שלח אימייל
                  </Button>
                  <Button 
                    startIcon={<PersonRemoveIcon />} 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={() => navigate(`/showGroup/${name}/${id}/manageUsers`)}  
                    fullWidth 
                    sx={{ ml: 1 }}
                  >
                    הסר
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h1" component="div" sx={{ fontSize: '4rem', mb: 2 }}>
            👥
          </Typography>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            {searchTerm ? "לא נמצאו חברים התואמים לחיפוש" : "עדיין אין חברים בקבוצה"}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            {searchTerm ? `לא נמצאו תוצאות עבור "${searchTerm}". נסה חיפוש אחר.` : "נראה שאין עדיין חברים בקבוצה זו. לחץ על 'הוסף חבר' כדי להתחיל."}
          </Typography>
          {searchTerm ? (
            <Button variant="outlined" onClick={() => setSearchTerm("")}>נקה חיפוש</Button>) 
          : (
            <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={() => navigate(`/showGroup/${name}/${id}/manageUsers`)}>
              הוסף חבר
            </Button>
          )}
        </Paper>
      )}
      {/* Context Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { 
          openEmailModal(contextMember?.email);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">שלח אימייל</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/showGroup/${name}/${id}/manageUsers`)}>
          <ListItemIcon>
            <PersonRemoveIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit" color="error">הסר מהקבוצה</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default GroupMembers;

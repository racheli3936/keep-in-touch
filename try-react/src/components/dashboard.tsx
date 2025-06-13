import { useEffect, useState } from "react";
import OpenNewGroup from "./openNewGroup";
import { Link, Outlet } from "react-router-dom";
import { Container, Typography, Button, List, ListItem, Box, Paper, Divider, Fade, ThemeProvider, alpha, Grid} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupStore from "../stores/GroupStore";
import { observer } from "mobx-react-lite";
import theme from "../styleComponent/theme";


const Dashboard = observer(() => {
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        await GroupStore.getAllGroups();
      } catch (err) {
        setError("שגיאה בטעינת הקבוצות");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">שגיאה: {error}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          נסה שנית
        </Button>
      </Box>
    );}

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Outlet />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper 
            elevation={0} 
            sx={{p: 0, borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', height: '85vh' }}>
            <Grid container sx={{ height: '100%' }}>
              {/* סרגל צד */}
              <Grid component="div" size={{ xs:12, md:3}} sx={{ 
                borderRight: { xs: 'none', md: '1px solid' }, 
                borderBottom: { xs: '1px solid', md: 'none' },
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: { xs: '100%',sm:'100%', md: '100%',lg:'auto' } // שינוי רוחב לסרגל צד
              }}>
                <Box sx={{ p: 3, 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  display: 'flex', alignItems: 'center', gap: 1.5
                }}>
                  <DashboardIcon color="primary" fontSize="large" />
                  <Typography variant="h5" fontWeight="500" color="primary.dark">
                    הקבוצות שלי
                  </Typography>
                </Box>
                
                <Divider />
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center'}}>
                  <OpenNewGroup />
                </Box>              
                <Divider />
                <List sx={{ 
                  flexGrow: 1, overflowY: 'auto', p: 2,
                  '& .MuiListItem-root': { mb: 1.5,  p: 0}}}>
                  {loading ? (
                    Array.from(new Array(3)).map((_, index) => (
                      <ListItem key={index}>
                        <Paper sx={{ width: '100%', p: 2, bgcolor: 'grey.100' }} />
                      </ListItem>
                    ))
                  ) : GroupStore.Groupslist.length > 0 ? (
                    GroupStore.Groupslist.map(group => (
                      <Fade in={true} key={group.id} timeout={300 + GroupStore.Groupslist.indexOf(group) * 100}>
                        <ListItem>
                          <Link 
                            to={`/showGroup/${group.name}/${group.id}`} 
                            style={{ textDecoration: 'none', width: '100%' }}>
                            <Button 
                              fullWidth
                              variant="outlined" 
                              color="primary" 
                              onClick={() => GroupStore.setCurrentGroup(group)}
                              sx={{
                                justifyContent: 'flex-start',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                                px: 2, py: 1.5, borderRadius: 2
                              }}
                              startIcon={<GroupIcon />}
                            >
                              <Box sx={{ textAlign: 'right', width: '100%' }}>
                                <Typography fontWeight="500" noWrap>
                                  {group.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" 
                                  noWrap sx={{ display: 'block' }}>
                                  מזהה מנהל: {group.adminId}
                                </Typography>
                              </Box>
                            </Button>
                          </Link>
                        </ListItem>
                      </Fade>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography color="text.secondary">
                        אין עדיין קבוצות
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        לחץ על "צור קבוצה חדשה" כדי להתחיל
                      </Typography>
                    </Box>
                  )}
                </List>
              </Grid>
              
              {/* תוכן ראשי */}
              <Grid  size={{xs:12, md:9}}  sx={{ height: '100%', display: { xs: 'none', md: 'flex' } }}>
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4
                }}>
                  <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 3 }} >
                    לוח הבקרה
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Typography variant="h6" color="text.secondary">
                        טוען קבוצות...
                      </Typography>
                    </Box>
                  ) : GroupStore.Groupslist.length > 0 ? (
                    <Paper 
                      sx={{p: 3, height: '100%', bgcolor: alpha(theme.palette.primary.light, 0.04),
                        display: 'flex',flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <Typography variant="h6" align="center" color="text.secondary">
                        בחר קבוצה מהרשימה כדי להציג את הפרטים שלה
                      </Typography>

                      <Box sx={{ display: 'flex',flexWrap: 'wrap', justifyContent: 'center', gap: 2,mt: 4}}>
                        {GroupStore.Groupslist.slice(0, 3).map(group => (
                          <Paper 
                            key={group.id}
                            sx={{p: 3, width: '180px', textAlign: 'center',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.08)' }}}>
                            <Box sx={{ mb: 2 }}>
                              <GroupIcon fontSize="large" color="primary" />
                            </Box>
                            <Typography fontWeight="500" gutterBottom>
                              {group.name}
                            </Typography>
                            <Link 
                              to={`/showGroup/${group.name}/${group.id}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <Button size="small" variant="contained"
                                onClick={() => GroupStore.setCurrentGroup(group)}
                                sx={{ mt: 1 }}>
                                פתח
                              </Button>
                            </Link>
                          </Paper>
                        ))}
                      </Box>
                    </Paper>
                  ) : (
                    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap: 2}}>
                      <AddCircleIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                      <Typography variant="h6" color="text.secondary">
                        אין עדיין קבוצות
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
});

export default Dashboard;

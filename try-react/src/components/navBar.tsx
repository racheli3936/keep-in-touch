import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../types/types";
import { Alert, Box, Typography, Tabs, Badge, Slide, useMediaQuery, IconButton, Menu, MenuItem, Divider, useTheme, Tooltip, Chip } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import { errorAlert } from "../utils/usefulFunctions";
import StyledTab from "../styleComponent/styleTab";
import { CustomButton2 } from "../styleComponent/myBotton";
const NavBar = () => {
  const theme = useTheme();
  const context = useContext(UserContext);
  const { user } = context;
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (location.pathname === '/') {
      setValue('/');
    } else if (location.pathname.includes('/dashboard')) {
      setValue('/dashboard');
    }
    else if (location.pathname.includes('/home')) {
      setValue('/home');
    }
    else {
      setValue(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (!user?.name || !user.phone || !user.address || !user.previousFamily) { setNeedsUpdate(true); }
    else { setNeedsUpdate(false); }
  }, [user]);

  const handleChange = (_event: any, newValue: string) => {
    if (needsUpdate) {
      errorAlert('נא לעדכן את הפרטים שלך לפני שתמשיך');
      return;
    }
    setValue(newValue);
    navigate(newValue);
  };
  const handleMenuClick = (event: any) => { setAnchorEl(event.currentTarget); };

  const handleMenuClose = () => { setAnchorEl(null); };

  const handleMenuNavigation = (path: string) => {
    if (needsUpdate) {
      errorAlert('נא לעדכן את הפרטים שלך לפני שתמשיך');
      return;
    }

    navigate(path);
    handleMenuClose();
  };

  const handleUpdateClick = () => { navigate("/update"); };

  return (
    <>
      {!isMobile && (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="main navigation"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#FF5722',
              height: 3,
              borderRadius: '3px 3px 0 0',
              boxShadow: '0 0 10px rgba(255, 87, 34, 0.5)',
            }
          }}
          sx={{
            minHeight: 48,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
          }}>
          <StyledTab icon={<DashboardIcon />} label="הקבוצות שלי" value="/dashboard" />
          <StyledTab icon={<HomeIcon />} label="בית" value="/home" />
        </Tabs>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="התראות" arrow>
            <IconButton color="inherit" sx={{
              color: 'white', mr: 1,
              '&:hover': { transform: 'scale(1.1)' },
              transition: 'transform 0.2s'
            }} >
              <Badge badgeContent={needsUpdate ? 1 : 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="תפריט" arrow>
            <IconButton color="inherit" onClick={handleMenuClick}
              sx={{
                color: 'white',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.2s'
              }} >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="navbar-menu"
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                minWidth: 180,
                overflow: 'visible',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >
            <MenuItem onClick={() => handleMenuNavigation('/home')} dense>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', direction: 'rtl' }}>
                <HomeIcon fontSize="small" sx={{ ml: 1.5, color: theme.palette.primary.main }} />
                <Typography>בית</Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => {
              handleMenuNavigation('/dashboard')
            }} dense>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', direction: 'rtl' }}>
                <DashboardIcon fontSize="small" sx={{ ml: 1.5, color: theme.palette.primary.main }} />
                <Typography>הקבוצות שלי</Typography>
              </Box>
            </MenuItem>

            {needsUpdate && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleUpdateClick} dense>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#9C27B0', direction: 'rtl' }}>
                    <WarningIcon fontSize="small" sx={{ ml: 1.5, color: theme.palette.secondary.main }} />
                    <Typography fontWeight="medium">עדכן פרטי משתמש</Typography>
                  </Box>
                </MenuItem>
              </>)}
          </Menu>
        </Box>)}
      {needsUpdate && (
        <Slide direction="down" in={needsUpdate} mountOnEnter unmountOnExit>
          <Alert severity="warning" variant="filled" icon={<WarningIcon />}
            sx={{
              position: 'absolute',
              top: { xs: 70, md: 80 },
              right: '0px',
              transform: 'translateX(-50%)',
              width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
              maxWidth: '430px',
              zIndex: 1000,
              borderRadius: 3,
              backgroundColor: '#FF5722',
              color: 'white',
              boxShadow: '0 5px 20px rgba(255, 87, 34, 0.4)',
              direction: 'rtl',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            action={<CustomButton2 text={"עדכן עכשיו"} onClickFunc={handleUpdateClick} />} >
            <Typography variant="body1" fontWeight="medium">
              יש לעדכן את הפרטים שלך לפני שתמשיך
            </Typography>
          </Alert>
        </Slide>
      )}

      {/* Optional: Notification badge for desktop */}
      {!isMobile && needsUpdate && (
        <Tooltip title="עדכון פרטים נדרש" arrow>
          <Chip
            icon={<WarningIcon fontSize="small" />}
            label="עדכון נדרש"
            color="secondary"
            size="small"
            onClick={handleUpdateClick}
            sx={{
              position: 'absolute',
              right: -10,
              top: -10,
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(255, 87, 34, 0.7)', },
                '70%': { boxShadow: '0 0 0 10px rgba(255, 87, 34, 0)', },
                '100%': { boxShadow: '0 0 0 0 rgba(255, 87, 34, 0)', },
              },
              '&:hover': { bgcolor: theme.palette.secondary.dark, },
              cursor: 'pointer', zIndex: 10
            }} />
        </Tooltip>)}
    </>);
};

export default NavBar;
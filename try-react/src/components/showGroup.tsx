import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, Outlet, useParams, useLocation } from "react-router-dom"
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, useTheme, useMediaQuery, Drawer, IconButton, Avatar, Divider, } from "@mui/material"
import { Calendar, MessageSquare, Users, FileText, ImageIcon, MenuIcon, Bot, Group } from "lucide-react"
import { pageVariants } from "./themeProvider"
import UserStore from "../stores/UserStore"

const ShowGroup = () => {
  const { name, id } = useParams()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await UserStore.getUsersForGroup(id || '');
      } catch (error:any) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
      } 
    };
    fetchUsers();
  }, [id]);
  
  // Determine active tab based on URL
  const getActiveTab = () => {
    const path = location.pathname
    if (path.includes("/events")) return 0
    if (path.includes("/massages")) return 1
    if (path.includes("/materials")) return 2
    if (path.includes("/groupMembers")) return 3
    if (path.includes("/calender")) return 4
    if (path.includes("/chat")) return 5
    if (path.includes("/manageUsers")) return 6
    return 0
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const tabs = [
    { label: "Events", icon: <ImageIcon size={20} />, path: `/showGroup/${name}/${id}/events` },
    { label: "Messages", icon: <MessageSquare size={20} />, path: `/showGroup/${name}/${id}/massages` },
    { label: "Materials", icon: <FileText size={20} />, path: `/showGroup/${name}/${id}/materials` },
    { label: "Members", icon: <Users size={20} />, path: `/showGroup/${name}/${id}/groupMembers` },
    { label: "Calendar", icon: <Calendar size={20} />, path: `/showGroup/${name}/${id}/calender` },
    { label: "Chat Bot", icon: <Bot size={20} />, path: `/showGroup/${name}/${id}/chat` },
    { label: "ניהול החברים", icon: <Group size={20} />, path: `/showGroup/${name}/${id}/manageUsers` },
  ]

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>{name?.charAt(0).toUpperCase()}</Avatar>
        <Typography variant="h6" noWrap>
          {name}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Tabs
        orientation="vertical"
        value={getActiveTab()}
        variant="scrollable"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          "& .MuiTab-root": {
            alignItems: "flex-start",
            textAlign: "left",
            pl: 0,
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            component={Link}
            to={tab.path}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {tab.icon}
                <Typography sx={{ ml: 1 }}>{tab.label}</Typography>
              </Box>
            }
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>
    </Box>
  )

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        color='default'
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          top:'68px',
          color:'#FF5722'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {name}
          </Typography>

          {/* Tabs */}
          {!isMobile && (
            <Tabs value={getActiveTab()} variant={isSmall ? "scrollable" : "standard"}>
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  component={Link}
                  to={tab.path}
                  icon={tab.icon}
                  label={!isSmall ? tab.label : undefined}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content - התאמות מיוחדות ללוח שנה */}
       
        <Box sx={{ 
          width: '100%', 
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Outlet />
        </Box>
    </motion.div>
  )
}

export default ShowGroup
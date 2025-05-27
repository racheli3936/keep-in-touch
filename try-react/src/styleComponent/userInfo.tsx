// UserInfo.js
import { Box, Typography } from '@mui/material';
import { User } from '../types/types';

const UserInfo = ({ user }:{user:User}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, textAlign: 'center' }}>
        {user?.name || 'אורח'}
      </Typography>
      {user?.email && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {user?.email}
        </Typography>
      )}
      {user?.phone && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {user?.phone}
        </Typography>
      )}
    </Box>
  );
};
// UserMenuItem.js
import { ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';

const UserMenuItem = ({ icon, text, onClick }:{ icon:any, text:any, onClick:any }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export { UserInfo,UserMenuItem };

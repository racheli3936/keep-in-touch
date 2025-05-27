import { Tab } from "@mui/material";

const StyledTab = ({ icon, label, value,...props}:{icon:any,label:any,value:any}) => {
  return (
    <Tab
      icon={icon}
      label={label}
      value={value}
      iconPosition="start"
      sx={{
        minWidth: 'auto',
        minHeight: 48,
        px: 2,
        py: 1.5,
        mr: { xs: 0.5, md: 1 },
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        '&.Mui-selected': {
          color: '#ffffff',
          fontWeight: 700,
        },
        '&:hover': {
          color: '#ffffff',
          opacity: 1
        },
        '& .MuiTab-iconWrapper': {
          mb: 0.5,
          mr: 1
        },
        transition: 'all 0.3s ease',
      }}
      {...props}
    />
  );
};
export default StyledTab;
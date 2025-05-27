
import { useScrollTrigger, Zoom, Box, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTop = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 100 });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Fab color="primary" size="medium" aria-label="scroll back to top" sx={{ bgcolor: '#FF5722', '&:hover': { bgcolor: '#E64A19', transform: 'scale(1.1)' }, transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(255, 87, 34, 0.4)' }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollTop;

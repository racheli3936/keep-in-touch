import { Button } from '@mui/material';

const CustomButton = ({ text }:{text:string}) => (
  <Button 
    color="inherit" 
    sx={{ 
      fontWeight: 'medium',
      opacity: 0.9,
      '&:hover': { opacity: 1 }
    }}
  >
    {text}
  </Button>
);
const CustomButton2    = ({ text,onClickFunc }:{text:string,onClickFunc:Function}) => (
  <Button
                color="inherit" 
                size="small" 
                variant="outlined"
              onClick={() => onClickFunc()}
                sx={{
                  borderRadius: 6,
                  fontWeight: 'bold',
                  borderColor: 'white',
                  marginRight:3,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                  }
                }}
              >
           {text}
              </Button>
);

export {CustomButton,CustomButton2};

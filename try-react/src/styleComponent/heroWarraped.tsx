import { Box, styled, Typography } from "@mui/material";

const HeroWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(8, 0),
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 24,
    background: 'linear-gradient(135deg, #F3F4F6 0%, #E9F0FF 100%)',
    boxShadow: '0 4px 32px rgba(0, 0, 0, 0.05)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
    }
}));
const GradientTypography = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
}));

export { HeroWrapper, GradientTypography };
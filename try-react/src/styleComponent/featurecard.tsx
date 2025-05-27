import { Card, CardContent, Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

const StyledCard = styled(Card)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
    }
}));

const FeatureCard = ({ icon, title, description, color }:{ icon:any, title:string, description:string, color :string}) => (
    <StyledCard>
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ backgroundColor: color, borderRadius: '50%', padding: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                    {icon}
                </Box>
                <Typography variant="h5" component="h2" fontWeight={600}>
                    {title}
                </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                {description}
            </Typography>
        </CardContent>
    </StyledCard>
);

export default FeatureCard;

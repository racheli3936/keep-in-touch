import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FeatureCard from '../styleComponent/featurecard';
import { Group as GroupIcon, CloudUpload as CloudUploadIcon, Security as SecurityIcon, Share as ShareIcon } from '@mui/icons-material';

const HomePage = () => {
    const theme = useTheme();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, []);

    const features = [
        {
            title: "ניהול קבוצות",
            description: "צור ונהל קבוצות משפחתיות או חברתיות לשיתוף קבצים ומידע ביעילות",
            icon: <GroupIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.primary.main
        },
        {
            title: "שיתוף קבצים",
            description: "העלה ושתף קבצים עם בני משפחה וחברים ללא מגבלות וללא צורך בחשבונות נוספים",
            icon: <CloudUploadIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.success.main
        },
        {
            title: "פרטיות ואבטחה",
            description: "פרטיות מובטחת עם הצפנה מלאה והגנה על המידע המשפחתי שלך",
            icon: <SecurityIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.error.main
        },
        {
            title: "תמיכה טכנית",
            description: "קבל תמיכה טכנית 24/6 בכל שאלה או בעיה",
            icon: <ShareIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.info.main
        }
    ];
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <motion.div initial="hidden" animate={loaded ? "visible" : "hidden"}>
                <Box display="flex" flexWrap="wrap" justifyContent="center">
                    {features.map((feature, index) => (
                        <Box key={index} sx={{  flex: '0 1 calc(40% - 16px)', margin: '8px' }} component="div">
                            <FeatureCard {...feature} />
                        </Box>
                    ))}
                </Box>
            </motion.div>
        </Container >
    );
};
export default HomePage;


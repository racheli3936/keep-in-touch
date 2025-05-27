import { Typography } from "@mui/material";
import { GradientTypography, HeroWrapper } from "../styleComponent/heroWarraped";
import logoKeepNew from "../assets/logoKeepNew.png";
const Wellcome = () => {
    return(
        <>
        <HeroWrapper sx={{ mb: 1 }}>
                    <GradientTypography variant="h2" sx={{  fontWeight: 650 }} >
                        ברוכים הבאים לפלטפורמת השיתוף הקבוצתית
                    </GradientTypography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: 700, mx: 'auto', mb: 1, px: 2, fontWeight: 400 }}>
                        המקום האידיאלי לשיתוף קבצים ותקשורת עם הקבוצה שלך
                    </Typography>
                    <img 
                    src={logoKeepNew}
                    alt="לוגו האתר"
                    style={{ width: '100%', height: 'auto', maxWidth: '500px', marginBottom: '0px' }} // הגדרת רוחב ל-100% וגובה ל-auto
                />
                </HeroWrapper>
        </>
    )
}
export default Wellcome;
import React from 'react';
import { motion } from 'framer-motion';
import { alpha, Box, Button, LinearProgress, Typography } from '@mui/material';
import { FileText, FileUp } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  colors: {
    light: string;
    primary: string;
    secondary: string;
  };
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Box sx={{
        mt: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: alpha(colors.light, 0.7),
        borderRadius: 2,
        p: 1.5,
        width: "fit-content",
        mx: "auto",
        border: `1px solid ${alpha(colors.primary, 0.2)}`
      }}>
        <FileText size={20} style={{ marginRight: 8, color: colors.primary }} />
        <Typography variant="body2" sx={{ color: colors.secondary, fontWeight: 500 }}>
          {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </Typography>
      </Box>
    </motion.div>
  );
}


interface UploadProgressProps {
  progress: number;
  colors: {
    primary: string;
    accent3: string;
    secondary: string;
  };
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{ mt: 1 }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1
        }}>
          <Typography variant="body2" sx={{ color: colors.secondary, fontWeight: 500 }}>
            התקדמות ההעלאה
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: progress >= 100 ? colors.accent3 : colors.primary,
              fontWeight: 700
            }}
          >
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(colors.primary, 0.15),
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent3})`,
              borderRadius: 4
            }
          }}
        />
      </Box>
    </motion.div>
  );
}


interface UploadButtonProps {
  handleUpload: () => void;
  isUploading: boolean;
  colors: {
    primary: string;
    secondary: string;
  };
}

const UploadButton: React.FC<UploadButtonProps> = ({ handleUpload, isUploading, colors }) => {
  return (
    <motion.div
      custom={2}
      variants={{ /* Define your itemVariants here or import them */ }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleUpload}
        disabled={isUploading}
        startIcon={isUploading ? null : <FileUp size={22} />}
        sx={{
          py: 1.5,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          background: `linear-gradient(45deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          boxShadow: `0 4px 20px ${alpha(colors.primary, 0.5)}`,
          color: "white",
          fontWeight: 600,
          fontSize: "1.1rem",
          textTransform: "none",
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary} 30%, ${colors.secondary} 90%)`,
            boxShadow: `0 6px 25px ${alpha(colors.primary, 0.6)}`
          },
          '&:disabled': {
            background: `linear-gradient(45deg, ${alpha(colors.primary, 0.7)} 0%, ${alpha(colors.secondary, 0.7)} 100%)`,
            color: alpha('#ffffff', 0.7)
          }
        }}
      >
        {isUploading ? "מעלה..." : "העלאת קובץ"}
      </Button>
    </motion.div>
  );
}

export { FilePreview,UploadProgress,UploadButton};

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box, Typography, TextField, Stack, Alert, Snackbar, Dialog, DialogContent, DialogTitle,
  IconButton, Backdrop, Fade, alpha, Grid, FormControl, Select, InputLabel, MenuItem
} from "@mui/material"
import { Upload, Calendar, FileText, Check, AlertCircle, Image, X } from "lucide-react"
import { ECategory } from "../types/types"
import EventsStore from "../stores/EventsStore"
import GroupStore from "../stores/GroupStore"
import { FilePreview, UploadButton, UploadProgress } from "../styleComponent/Uploader"
import { FileUploaderModalProps, itemVariants, modalVariants } from "../styleComponent/uploaderFunctions"

const FileUploaderModal: React.FC<FileUploaderModalProps> = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState<string>("")
  const [newContent, setNewContent] = useState<string>("hello")
  const [token] = useState(localStorage.getItem("token"))
  const [eventDate, setEventDate] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDragActive, setIsDragActive] = useState(false)
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const colors = {
    primary: "#4361EE", secondary: "#3A0CA3", accent1: "#4CC9F0",
    accent2: "#F72585", accent3: "#7209B7", light: "#F8F9FA", dark: "#212529"
  }

  useEffect(() => {
    if (open) {
      setFile(null)
      setProgress(0)
      setEventDate("")
      setIsUploading(false)
      setShowSuccess(false)
      setShowError(false)
      setErrorMessage("")
    }
  }, [open])

  useEffect(() => {
    if (file && url !== "" && eventDate) {
      const data = {
        groupId: GroupStore.currentGroup.id,
        fileName: file.name,
        filePath: url,
        FileSize: file.size,
        Category: ECategory.wedding,
        Description: description,
        Content: "picture",
        FileType: file.type,
        eventDate: new Date(eventDate),
      }
      EventsStore.addEvent(data);
      setFile(null);
      setUrl("");
      setEventDate("");
    }
  }, [file, url, eventDate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file first")
      setShowError(true)
      return
    }

    if (!eventDate) {
      setErrorMessage("Please select an event date")
      setShowError(true)
      return
    }

    setIsUploading(true)

    try {
      const response = await axios.get("https://keepintouch.onrender.com/api/Upload/presigned-url", {
        params: {
          fileName: file.name,
          fileType: file.type
        },
      })

      const presignedUrl = response.data.url

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })
      try {
        await getDownloadUrl()
        await extractTextFromImg()
        await saveTheContentOfTheFile()
        console.log("i extract");
        
      }
      catch (e: any) {
        console.log(e);
      }
      setShowSuccess(true)
      setIsUploading(false)

      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess()
        setTimeout(() => {
          onClose()
        }, 1500)
      }, 1500)
    } catch (error) {
      console.error("Upload error:", error)
      setErrorMessage("Failed to upload file. Please try again.")
      setShowError(true)
      setIsUploading(false)
    }
  }

  const getDownloadUrl = async () => {
    const response = await axios.get(`https://keepintouch.onrender.com/api/Download/download-url/${file?.name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setUrl(response.data as string)
  }

  const extractTextFromImg = async () => {
    try {
      const response = await axios.post(`https://keepintouch.onrender.com/api/File/readtext?fileName=${file?.name}`)
      console.log(response.data);
      
      await setNewContent(response.data as string)
    } catch (err) {
      console.log("Error in extractTextFromImg", err)
    }
  }

  const saveTheContentOfTheFile = async () => {
    console.log("new----contect",newContent,"new-------content");
    
    try {
      await axios.put(
        `https://keepintouch.onrender.com/api/File/${EventsStore.currentEventAdd?.id}/content`,
        newContent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
    } catch (error: any) {
      console.error("Error updating content:", error.response ? error.response.data : error.message)
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload size={48} />
    const type = file.type.split('/')[0]
    if (type === 'image') return <Image size={48} />
    return <FileText size={48} />
  }

  return (
    <Dialog open={open} onClose={!isUploading ? onClose : undefined} fullWidth maxWidth="sm" // שינוי ל-sm
      sx={{ '& .MuiDialog-paper': { borderRadius: 3, overflow: 'hidden', boxShadow: `0 10px 40px -5px ${alpha(colors.accent3, 0.5)}` } }} // הקטנת הצל
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: alpha(colors.dark, 0.6), // שינוי צבע רקע
            backdropFilter: 'blur(3px)'
          }
        }
      }}>
      <AnimatePresence>
        {open && (
          <motion.div initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
            <DialogTitle sx={{
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1
            }}>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight="bold">העלאת קובץ</Typography>
              </Box>
              <IconButton onClick={onClose}
                disabled={isUploading} sx={{ color: 'white', '&:hover': { backgroundColor: alpha('#ffffff', 0.2) } }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 1 }}>
              <Box sx={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", pt: 1 }}>
                <Stack spacing={2} sx={{ width: "100%" }}>
                  {/* Drag & Drop Area */}
                  <motion.div custom={0} variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Box
                      sx={{
                        border: `2px dashed ${isDragActive ? colors.accent2 : alpha(colors.primary, 0.3)}`, // הקטנת רוחב הקו
                        borderRadius: 4, p: 2, textAlign: "center", // הקטנת padding
                        backgroundColor: isDragActive
                          ? alpha(colors.accent1, 0.1)
                          : alpha(colors.light, 0.8),
                        transition: "all 0.3s ease", cursor: "pointer", position: "relative", overflow: "hidden",
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("modal-file-input")?.click()}
                    >
                      <input id="modal-file-input" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                      <Box sx={{
                        mb: 2, color: file ? colors.primary : alpha(colors.primary, 0.7),
                        transition: 'color 0.3s ease',
                        animation: isDragActive ? 'bounce 1s infinite alternate' : 'none',
                      }}>
                        {getFileIcon()}
                      </Box>
                      <Typography variant="h6" gutterBottom
                        sx={{ color: isDragActive ? colors.accent2 : colors.secondary, fontWeight: 600 }} >
                        {isDragActive ? "שחרר את הקובץ כאן" : "גרור קובץ לכאן או לחץ לבחירה"}
                      </Typography>

                      <Typography variant="body2" sx={{ color: alpha(colors.dark, 0.6), maxWidth: "80%", mx: "auto", mt: 1 }} >
                        ניתן להעלות תמונות בלבד
                      </Typography>

                      <AnimatePresence>
                        {file && (<FilePreview file={file} colors={colors} />)}
                      </AnimatePresence>
                    </Box>
                  </motion.div>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 4 }} >
                      <TextField label="תאריך האירוע" type="date" value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          sx: { fontWeight: 500, color: colors.secondary }
                        }}
                        InputProps={{
                          startAdornment: <Calendar size={20} style={{ marginRight: 8, color: colors.primary }} />,
                          sx: {
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(colors.primary, 0.3),
                              transition: 'all 0.3s ease'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.primary
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.primary,
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel shrink sx={{ fontWeight: 500, color: colors.secondary }}>
                          קטגוריה
                        </InputLabel>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(colors.primary, 0.3),
                              transition: 'all 0.3s ease'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.primary
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: colors.primary,
                              borderWidth: 2
                            }
                          }}
                        >
                          {Object.values(ECategory).map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField label="תיאור" value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth multiline rows={1}
                        InputLabelProps={{
                          shrink: true,
                          sx: { fontWeight: 500, color: colors.secondary }
                        }}
                        sx={{
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(colors.primary, 0.3),
                            transition: 'all 0.3s ease'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary,
                            borderWidth: 2
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* Upload Button */}
                  <UploadButton handleUpload={handleUpload} isUploading={isUploading} colors={colors} />
                  {/* Progress Indicator */}
                  <AnimatePresence>
                    {isUploading && (<UploadProgress progress={progress} colors={colors} />)}
                  </AnimatePresence>
                </Stack>
              </Box>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Snackbar */}
      <Snackbar open={showSuccess} autoHideDuration={5000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" icon={<Check />} onClose={() => setShowSuccess(false)}
          sx={{ backgroundColor: colors.accent3, '& .MuiAlert-icon': { color: 'white' } }}>
          הקובץ הועלה בהצלחה!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={showError} autoHideDuration={5000}
        onClose={() => setShowError(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" variant="filled" icon={<AlertCircle />}
          onClose={() => setShowError(false)} sx={{ backgroundColor: colors.accent2 }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}

export default FileUploaderModal

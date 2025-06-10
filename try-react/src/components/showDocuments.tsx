import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Box, Grid, Card, CardActions, Button, Typography, Skeleton, IconButton, Dialog, DialogContent, useTheme, Tooltip, CircularProgress } from "@mui/material"
import { Download, ZoomIn, X, FileType } from "lucide-react"
import EventsStore from "../stores/EventsStore"
import { staggerContainerVariants, itemVariants, hoverVariants } from "./themeProvider"
import { observer } from "mobx-react-lite"

interface ShowDocumentsProps {
  searchTerm?: string
}

const ShowDocuments = observer(({ searchTerm = "" }: ShowDocumentsProps) => {
  const [urls, setUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)
  const theme = useTheme()

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      try {
        await EventsStore.getEvevntByGroupId()
        await setUrls(EventsStore.urlList)
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const extractNameFromUrl = (url: string) => {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname
    return pathname.substring(pathname.lastIndexOf("/") + 1)
  }

  const getFileType = (url: string) => {
    const name = extractNameFromUrl(url).toLowerCase()
    if (name.endsWith(".pdf")) {
      return "pdf"
    }
    if (name.endsWith(".doc") || name.endsWith(".docx")) {
      return "doc"
    }
    return "other"
  }

  const downloadDocument = async (url: string, index: number) => {
    setDownloadingIndex(index)

    try {
      await EventsStore.getEvevntByGroupId()
      const allUrls = EventsStore.urlList
      const renderUrl = allUrls.find((u) => extractNameFromUrl(u) === extractNameFromUrl(url))

      if (renderUrl) {
        const response = await fetch(renderUrl)
        const blob = await response.blob()
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = extractNameFromUrl(url)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      } else {
        alert("File not found")
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    } finally {
      setDownloadingIndex(null)
    }
  }

  const openFilePreview = (url: string) => {
    setSelectedFile(url)
  }

  const closeFilePreview = () => {
    setSelectedFile(null)
  }

  // Filter URLs based on search term and keep only non-image files
  const filteredUrls = urls.filter((url) => {
    const fileType = getFileType(url)
    const fileName = extractNameFromUrl(url).toLowerCase()
    return (fileType === "pdf" || fileType === "doc") && fileName.includes(searchTerm.toLowerCase())
  })

  return (
    <motion.div variants={staggerContainerVariants} initial="initial" animate="animate">
      {isLoading ? (
        // Loading skeleton
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid size={{xs:12, sm:6, md:4}}  key={index}>
              <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Skeleton variant="rectangular" height={200} />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredUrls.length === 0 ? (
        // Empty state
        <Box sx={{ textAlign: "center", py: 4 }}>
          <FileType size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? "No matching files found" : "No documents uploaded yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? "Try a different search term" : "Upload your first document to get started"}
          </Typography>
        </Box>
      ) : (
        // Gallery grid
        <Grid container spacing={3}>
          {filteredUrls.map((url, index) => {
            const fileName = extractNameFromUrl(url)

            return (
              <Grid size={{ xs:12, sm:6, md:4}} key={index}>
                <motion.div variants={itemVariants}>
                  <motion.div variants={hoverVariants} initial="initial" whileHover="hover">
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <FileType size={64} color={theme.palette.text.secondary} />
                      </Box>

                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" noWrap title={fileName}>
                          {fileName}
                        </Typography>
                      </Box>

                      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            downloadingIndex === index ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <Download size={16} />
                            )
                          }
                          onClick={() => downloadDocument(url, index)}
                          disabled={downloadingIndex === index}
                        >
                          {downloadingIndex === index ? "Downloading..." : "Download"}
                        </Button>

                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => openFilePreview(url)}
                            sx={{
                              bgcolor: "rgba(63, 81, 181, 0.1)",
                              "&:hover": {
                                bgcolor: "rgba(63, 81, 181, 0.2)",
                              },
                            }}
                          >
                            <ZoomIn size={18} />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* File Preview Dialog */}
      <Dialog
        open={!!selectedFile}
        onClose={closeFilePreview}
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <IconButton
          onClick={closeFilePreview}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.7)",
            },
            zIndex: 1,
          }}
        >
          <X size={20} />
        </IconButton>

        <DialogContent sx={{ p: 0, overflow: "hidden" }}>
          {selectedFile && (
            <iframe
              src={selectedFile}
              title="Preview"
              style={{ width: "100%", height: "90vh", border: "none" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
)

export default ShowDocuments

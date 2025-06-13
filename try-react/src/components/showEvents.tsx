import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Box, Grid, Card, CardMedia, CardActions, Button, Typography, Skeleton, IconButton, Dialog, DialogContent, Tooltip, CircularProgress } from "@mui/material"
import { Download, ZoomIn, X, ImageIcon, Delete } from "lucide-react"
import EventsStore from "../stores/EventsStore"
import { staggerContainerVariants, itemVariants, hoverVariants } from "./themeProvider"
import { observer } from "mobx-react-lite"


interface ShowEventsProps {
  searchTerm?: string
}

const ShowEvents = observer(({ searchTerm = "" }: ShowEventsProps) => {
  const [urls, setUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)
  const [deleteIndex, setDeletIndex] = useState<boolean>(false)

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)
      try {
        await EventsStore.getEvevntByGroupId()
        await setUrls(EventsStore.urlList)
      } catch (error) {
        console.error("Error fetching images:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchImages()
  }, [])

  const extractNameFromUrl = (url: string) => {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname
    return pathname.substring(pathname.lastIndexOf("/") + 1)
  }

  const getFileType = (url: string) => {
    const name = extractNameFromUrl(url).toLowerCase()
    if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif")) {
      return "image"
    }
    return "other"
  }
  const deleteImage = async (url: string) => {
    setDeletIndex(true)
    try {
      const eventId = await getEventId(url)
      EventsStore.deleteEvent(url, eventId ? eventId : 0)
      urls.splice(urls.indexOf(url), 1)
      setUrls([...urls])
    }
    catch (e: any) {
      console.log(e);

    }
    finally {
      setDeletIndex(false)
    }

  }
  const getEventId = async (url: string) => {
    return EventsStore.Eventlist.find(e => e.filePath == url)?.id
  }

  const downloadImage = async (url: string, index: number) => {
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

  const openImagePreview = (url: string) => {
    setSelectedImage(url)
  }

  const closeImagePreview = () => {
    setSelectedImage(null)
  }

  // Filter URLs based on search term and keep only images
  const filteredUrls = urls.filter((url) => {
    const fileType = getFileType(url)
    const fileName = extractNameFromUrl(url).toLowerCase()
    return fileType === "image" && fileName.includes(searchTerm.toLowerCase())
  })

  return (
    <motion.div variants={staggerContainerVariants} initial="initial" animate="animate">
      {isLoading ? (
        // Loading skeleton
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
          <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? "No matching files found" : "No images uploaded yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? "Try a different search term" : "Upload your first image to get started"}
          </Typography>
        </Box>
      ) : (
        // Gallery grid
        <Grid container spacing={3}>
          {filteredUrls.map((url, index) => {
            const fileName = extractNameFromUrl(url)

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                      <CardMedia
                        component="img"
                        height="200"
                        image={url}
                        alt={fileName}
                        sx={{
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onClick={() => openImagePreview(url)}
                      />

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
                          onClick={() => downloadImage(url, index)}
                          disabled={downloadingIndex === index}
                        >
                          {downloadingIndex === index ? "מוריד..." : "הורדה"}
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={
                            deleteIndex ==true ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <Delete size={16} />
                            )
                          }
                          onClick={() => deleteImage(url)}
                          disabled={deleteIndex == true}
                        >
                          {deleteIndex ==true ? "מוחק..." : "מחיקה"}
                        </Button>

                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => openImagePreview(url)}
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

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={closeImagePreview}
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
          onClick={closeImagePreview}
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
          {selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
)

export default ShowEvents

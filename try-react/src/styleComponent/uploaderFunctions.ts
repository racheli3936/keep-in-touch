export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 500 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, type: "spring", damping: 25, stiffness: 500 }
  })
}
 export interface FileUploaderModalProps {
  open: boolean
  onClose: () => void
  onUploadSuccess?: () => void
}
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
  open: boolean;
  onClose: () => void;
  testType?: string; // "BBA" or "PERSONALITY" or custom test name
};

const shareUrl = typeof window !== "undefined" ? window.location.href : "";

export default function ShareDialog({ open, onClose, testType = "BBA" }: Props) {
  // Get test name and share text based on test type
  const getTestName = () => {
    if (testType === "PERSONALITY" || testType.toLowerCase().includes("personality")) {
      return "Personality Test";
    }
    return "Body Behaviour Analysis (BBA) Test";
  };

  const getShareText = () => {
    if (testType === "PERSONALITY" || testType.toLowerCase().includes("personality")) {
      return `Hi! I just tried the *_Personality Test_* and it's completely free! 

You should definitely try it too - it's an amazing way to:
• *_Discover your personality dimensions_*
• *_Understand your mind style and stress response_*
• *_Learn about your health, social, energy, and habit patterns_*

It's insightful and totally worth checking out!`;
    }
    return `Hi! I just tried the *_Body Behaviour Analysis (BBA) Test_* and it's completely free! 

You should definitely try it too - it's an amazing way to:
• *_Discover your body type_*
• *_Understand your natural constitution_*
• *_Identify energy imbalances_*

It's insightful and totally worth checking out!`;
  };

  const shareText = getShareText();
  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Link copied to clipboard!");
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Link copied to clipboard!");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getTestName(),
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(138, 43, 226, 0.1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
            animation: "shimmer 2s linear infinite",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Share with Friends
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": { color: "#00ffff" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "rgba(255, 255, 255, 0.8)",
              fontStyle: "italic",
              p: 2,
              bgcolor: "rgba(0, 255, 255, 0.05)",
              borderRadius: 1,
              borderLeft: "3px solid #00ffff",
            }}
          >
            {shareText}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleShare("facebook")}
                sx={{
                  color: "#1877f2",
                  borderColor: "#1877f2",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#1877f2",
                    bgcolor: "rgba(24, 119, 242, 0.1)",
                  },
                }}
              >
                Facebook
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TwitterIcon />}
                onClick={() => handleShare("twitter")}
                sx={{
                  color: "#1da1f2",
                  borderColor: "#1da1f2",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#1da1f2",
                    bgcolor: "rgba(29, 161, 242, 0.1)",
                  },
                }}
              >
                Twitter
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                onClick={() => handleShare("whatsapp")}
                sx={{
                  color: "#25d366",
                  borderColor: "#25d366",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#25d366",
                    bgcolor: "rgba(37, 211, 102, 0.1)",
                  },
                }}
              >
                WhatsApp
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={6} sm={3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LinkedInIcon />}
                onClick={() => handleShare("linkedin")}
                sx={{
                  color: "#0077b5",
                  borderColor: "#0077b5",
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#0077b5",
                    bgcolor: "rgba(0, 119, 181, 0.1)",
                  },
                }}
              >
                LinkedIn
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, flexDirection: "column", gap: 1 }}>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleNativeShare}
              sx={{
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                fontWeight: 700,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
                },
              }}
            >
              Share via Device
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: "100%" }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyLink}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(0, 255, 255, 0.3)",
              py: 1.5,
              "&:hover": {
                borderColor: "#00ffff",
                bgcolor: "rgba(0, 255, 255, 0.1)",
              },
            }}
          >
            Copy Link
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
}


import React, { useState, useRef } from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { CloudUpload, Person } from "@mui/icons-material";
import { uploadProfileImage } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
}

export default function ProfileImageUpload({
  currentImage,
  onUploadSuccess,
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuth();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadProfileImage(file);
      const imageUrl = `${API_BASE}${response.data.imageUrl}`;
      updateUser(response.data.user);
      setPreview(imageUrl);
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Avatar
        src={preview || undefined}
        sx={{
          width: 120,
          height: 120,
          border: "3px solid rgba(0, 255, 255, 0.5)",
          bgcolor: "rgba(0, 255, 255, 0.1)",
        }}
      >
        <Person sx={{ fontSize: 60, color: "#00ffff" }} />
      </Avatar>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            color: "#00ffff",
            borderColor: "rgba(0, 255, 255, 0.5)",
            textTransform: "uppercase",
            "&:hover": {
              borderColor: "#00ffff",
              background: "rgba(0, 255, 255, 0.1)",
            },
          }}
        >
          Select Image
        </Button>

        {fileInputRef.current?.files?.[0] && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
            sx={{
              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
              color: "#0a0e27",
              textTransform: "uppercase",
              "&:hover": {
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
              },
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        )}

        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", textAlign: "center" }}>
          Max file size: 5MB
        </Typography>
      </Box>
    </Box>
  );
}


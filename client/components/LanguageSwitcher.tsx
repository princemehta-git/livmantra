import React from "react";
import { useRouter } from "next/router";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "zh", name: "Mandarin Chinese", native: "中文" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ur", name: "Urdu", native: "اردو" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLanguage = languages.find((lang) => lang.code === router.locale) || languages[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (locale: string) => {
    handleClose();
    // Save to localStorage
    localStorage.setItem("livmantra_language", locale);
    // Change locale using Next.js router
    await router.push(router.asPath, router.asPath, { locale });
  };

  // Check if current locale is RTL
  const isRTL = router.locale === "ar" || router.locale === "ur";

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handleClick}
          startIcon={<LanguageIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
          sx={{
            color: "#00ffff",
            fontWeight: 600,
            px: { xs: 0.75, sm: 1.5, md: 2 },
            py: { xs: 0.4, sm: 0.75, md: 1 },
            minWidth: { xs: "auto", sm: "auto" },
            borderRadius: 0,
            border: "1px solid rgba(0, 255, 255, 0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 4px 0 0" },
            },
            "&:hover": {
              bgcolor: "rgba(0, 255, 255, 0.1)",
              borderColor: "rgba(0, 255, 255, 0.5)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            {currentLanguage.code.toUpperCase()}
          </Box>
        </Button>
      </motion.div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(10, 14, 39, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            borderRadius: 0,
            mt: 1,
            maxHeight: "400px",
            "& .MuiMenuItem-root": {
              color: "#00ffff",
              "&:hover": {
                bgcolor: "rgba(0, 255, 255, 0.1)",
              },
              "&.Mui-selected": {
                bgcolor: "rgba(0, 255, 255, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(0, 255, 255, 0.3)",
                },
              },
            },
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={router.locale === lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            sx={{
              direction: lang.code === "ar" || lang.code === "ur" ? "rtl" : "ltr",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <Box sx={{ fontWeight: 600, minWidth: "60px" }}>{lang.native}</Box>
              <Box sx={{ fontSize: "0.75rem", opacity: 0.7 }}>({lang.name})</Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}




import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  Select,
  Typography,
} from "@mui/material";
import { countryCodes, getCountryByCode, CountryCode } from "../data/countryCodes";
import { detectCountryFromIP } from "../lib/ipGeolocation";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  sx?: any;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

export default function PhoneInput({
  value,
  onChange,
  label = "Phone",
  required = false,
  fullWidth = true,
  sx,
  countryCode: externalCountryCode,
  onCountryCodeChange,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectingCountry, setDetectingCountry] = useState(true);

  // Detect country from IP on mount
  useEffect(() => {
    const detectCountry = async () => {
      if (externalCountryCode) {
        const country = getCountryByCode(externalCountryCode);
        if (country) {
          setSelectedCountry(country);
          setDetectingCountry(false);
          return;
        }
      }

      try {
        const detectedCode = await detectCountryFromIP();
        const country = getCountryByCode(detectedCode);
        if (country) {
          setSelectedCountry(country);
          if (onCountryCodeChange) {
            onCountryCodeChange(country.code);
          }
        } else {
          // Fallback to US
          const usCountry = getCountryByCode("US");
          if (usCountry) {
            setSelectedCountry(usCountry);
            if (onCountryCodeChange) {
              onCountryCodeChange("US");
            }
          }
        }
      } catch (error) {
        console.debug("Error detecting country:", error);
        // Fallback to US
        const usCountry = getCountryByCode("US");
        if (usCountry) {
          setSelectedCountry(usCountry);
          if (onCountryCodeChange) {
            onCountryCodeChange("US");
          }
        }
      } finally {
        setDetectingCountry(false);
      }
    };

    detectCountry();
  }, [externalCountryCode, onCountryCodeChange]);

  // Parse existing phone value if it includes country code
  useEffect(() => {
    if (value && !phoneNumber) {
      // Check if value starts with a country code
      for (const country of countryCodes) {
        if (value.startsWith(country.dialCode)) {
          setSelectedCountry(country);
          setPhoneNumber(value.substring(country.dialCode.length).trim());
          if (onCountryCodeChange) {
            onCountryCodeChange(country.code);
          }
          return;
        }
      }
      // If no country code found, assume it's just the number
      setPhoneNumber(value);
    }
  }, [value, phoneNumber, onCountryCodeChange]);

  // Update parent when phone number changes
  useEffect(() => {
    if (selectedCountry) {
      const fullPhone = phoneNumber
        ? `${selectedCountry.dialCode}${phoneNumber}`
        : selectedCountry.dialCode;
      onChange(fullPhone);
    }
  }, [phoneNumber, selectedCountry, onChange]);

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode);
    if (country) {
      setSelectedCountry(country);
      if (onCountryCodeChange) {
        onCountryCodeChange(country.code);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Only digits
    setPhoneNumber(input);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, ...sx }}>
      <Select
        value={selectedCountry?.code || ""}
        onChange={(e) => handleCountryChange(e.target.value)}
        disabled={detectingCountry}
        sx={{
          minWidth: 140,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 255, 255, 0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00ffff",
          },
          "& .MuiSelect-select": {
            color: "#fff",
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
          bgcolor: "rgba(0, 255, 255, 0.05)",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "rgba(10, 14, 39, 0.95)",
              border: "1px solid rgba(0, 255, 255, 0.3)",
              maxHeight: 400,
            },
          },
        }}
      >
        {countryCodes.map((country) => (
          <MenuItem
            key={country.code}
            value={country.code}
            sx={{
              color: "#fff",
              "&:hover": {
                bgcolor: "rgba(0, 255, 255, 0.1)",
              },
              "&.Mui-selected": {
                bgcolor: "rgba(0, 255, 255, 0.2)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <Typography sx={{ fontSize: "1.2rem" }}>{country.flag}</Typography>
              <Typography sx={{ flex: 1 }}>{country.dialCode}</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                {country.code}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>

      <TextField
        fullWidth={fullWidth}
        label={label}
        value={phoneNumber}
        onChange={handlePhoneChange}
        required={required}
        placeholder="Enter phone number"
        InputProps={{
          startAdornment: selectedCountry && (
            <InputAdornment position="start">
              <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem" }}>
                {selectedCountry.flag}
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": {
              borderColor: "rgba(0, 255, 255, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 255, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00ffff",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
          },
        }}
      />
    </Box>
  );
}

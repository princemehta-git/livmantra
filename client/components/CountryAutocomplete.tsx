import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material";
import { getAllCountryNames } from "../data/countryCodes";

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  sx?: any;
}

export default function CountryAutocomplete({
  value,
  onChange,
  label = "Nationality",
  required = false,
  fullWidth = true,
  sx,
}: CountryAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const countries = getAllCountryNames();

  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={countries}
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue || "");
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
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
            ...sx,
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            color: "#fff",
            "&:hover": {
              bgcolor: "rgba(0, 255, 255, 0.1)",
            },
            "&.Mui-focused": {
              bgcolor: "rgba(0, 255, 255, 0.2)",
            },
          }}
        >
          <Typography>{option}</Typography>
        </Box>
      )}
      ListboxProps={{
        sx: {
          bgcolor: "rgba(10, 14, 39, 0.95)",
          border: "1px solid rgba(0, 255, 255, 0.3)",
          maxHeight: 300,
          "& .MuiAutocomplete-option": {
            color: "#fff",
          },
        },
      }}
      PaperComponent={({ children, ...other }) => (
        <Box
          {...other}
          sx={{
            bgcolor: "rgba(10, 14, 39, 0.95)",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          {children}
        </Box>
      )}
    />
  );
}

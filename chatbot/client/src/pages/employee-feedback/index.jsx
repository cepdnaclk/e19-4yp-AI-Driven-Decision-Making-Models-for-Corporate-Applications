import React, { useState, useContext } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";

const EmployeeFeedback = ({ onSubmit }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit?.(feedback);
      setFeedback(""); // Clear after submit
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        borderRadius: "8px",
        padding: 3,
        maxWidth: "80%",
        margin: "0 auto",
        mt: 4,
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="left" marginBottom="20px">
        Your Safe Space to Speak! Share Your Feedback.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        placeholder="Enter your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#2c2c2c" : "#fff",
          borderRadius: 1,
          mb: 2,
        }}
        InputProps={{
          style: {
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
          },
        }}
      />

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleSubmit}
        disabled={!feedback.trim()}
        sx={{ textTransform: "none", fontWeight: "bold" }}
      >
        Submit Feedback
      </Button>
    </Box>
  );
};

export default EmployeeFeedback;

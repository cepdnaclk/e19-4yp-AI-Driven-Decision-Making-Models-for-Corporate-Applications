import React, { useState } from "react";
import { IconButton, InputBase, Paper, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { tokens } from "../../theme";

const EmployeeChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderRadius: 3,
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
          backgroundColor:
            theme.palette.mode === "dark" ? colors.grey[500] : colors.grey[900],
        }}
      >
      <InputBase
        placeholder="Ask anything"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          flex: 1,
          color: theme.palette.text.primary,
          mx: 1,
        }}
      />
      <IconButton onClick={handleSend} sx={{ color: theme.palette.text.primary }}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default EmployeeChatInput;

import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import EmployeeChatInput from "../../components/global/EmployeeChatInput";
import { tokens } from "../../theme";

const EmployeeChatInterface = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);

  const handleSend = (msg) => {
    setMessages([...messages, { text: msg, sender: "user" }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Bot reply to: " + msg, sender: "bot" }]);
    }, 1000);
  };

  return (
    <Box
      height="88%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? colors.primary[500] : "#f5f5f5",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        p: 2,
      }}
    >
      

      {/* Message List */}
      <Box
        flex={1}
        overflow="auto"
        my={2}
        maxHeight="60vh"
        sx={{ pr: 1 }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.sender === "user" ? "right" : "left",
              mb: 1,
              px: 2,
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                backgroundColor:
                  msg.sender === "user"
                    ? theme.palette.mode === "dark"
                      ? "#3f51b5"
                      : "#e3f2fd"
                    : theme.palette.mode === "dark"
                      ? "#424242"
                      : "#e0e0e0",
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                p: 1,
                borderRadius: 2,
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Empty Message Prompt */}
      {messages.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              color: theme.palette.mode === "dark" ? theme.palette.text.primary : theme.palette.text.primary,
            }}
          >
            How can I assist you today?
          </Typography>
        </Box>
      )}

      {/* Input Field */}
      <EmployeeChatInput onSend={handleSend} />
    </Box>
  );
};

export default EmployeeChatInterface;

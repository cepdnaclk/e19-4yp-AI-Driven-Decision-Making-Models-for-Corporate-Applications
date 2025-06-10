import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import { AlertContext } from "./AlertContext";

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert.open && alert.severity === "success" && (
        <Alert severity="success">{alert.message}</Alert>
      )}
      {alert.open && alert.severity === "warning" && (
        <Alert severity="warning">{alert.message}</Alert>
      )}
      {alert.open && alert.severity === "error" && (
        <Alert severity="error">{alert.message}</Alert>
      )}
      {children}
    </AlertContext.Provider>
  );
}

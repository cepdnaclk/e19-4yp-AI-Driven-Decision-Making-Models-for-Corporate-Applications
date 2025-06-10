import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertContext } from "../../contexts/AlertContext";
import { ColorModeContext, tokens } from "../../theme";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// ... (imports)
import axios from "axios";

const HRAppbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { showAlert } = useContext(AlertContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleLogoutClick = () => {
  //   // Navigate to '/login' when logout is clicked
  //   const token = localStorage.getItem("token"); // Get the token from local storage
  //   axios
  //     .delete("/login/logout", { token })
  //     .then((res) => {
  //       showAlert("Loged out", "success");
  //       localStorage.clear(); // Clear the local storage
  //       axios.defaults.headers.common["Authorization"] = ""; // Remove the authorization header
  //       navigate("/login");
  //       handleMenuClose(); // Close the menu after navigation
  //       window.location.reload(); // Reload the page
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       showAlert(err.resopnse.data.message, "error");
  //     });
  // };

 const handleProfileClick = () => {
    // Navigate to '/supe-admin-profile' when profile is clicked
    navigate("/hr-profile");
    handleMenuClose(); // Close the menu after navigation
    window.location.reload(); // Reload the page
  };

  const shouldRenderAppBar = location.pathname !== "/login"; // Check if the current route is not '/login'
 
  return (
    <>
      {shouldRenderAppBar && (
        <Box display="flex" justifyContent="space-between" p={3}>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            width="95px"  
            height="5%"
            justifyContent="center"
            alignItems="center"
          >
            LEARNLink <ArrowDownIcon />
          </Box>

          {/* ICONS */}
          <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfileClick}>
                <PersonOutlinedIcon to="/hr-profile" sx={{ marginRight: 1 }} />
                Profile
              </MenuItem>
              <MenuItem>
                <LogoutOutlinedIcon sx={{ marginRight: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      )}
    </>
  );
};

export default HRAppbar;

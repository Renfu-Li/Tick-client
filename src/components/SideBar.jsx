import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SideBar({ setToken }) {
  // anchorEl and Menu related learned from App Bar in MUI
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-account"
        onClick={handleMenu}
      >
        <AccountCircleIcon fontSize="large"></AccountCircleIcon>
      </IconButton>

      <Menu
        id="menu-account"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout} component={Link} to={"/"} dense>
          Log out
        </MenuItem>
      </Menu>
    </Box>
  );
}

import BarChartIcon from "@mui/icons-material/BarChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Sidebar({ setToken }) {
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
    <Stack
      borderRight={0.5}
      borderColor="lightgray"
      flex="none"
      height="100%"
      width="50px"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="rgb(249, 249, 249)"
      paddingY="0.5em"
      boxSizing="border-box"
    >
      <Stack spacing={1}>
        <NavLink to="/lists">
          <IconButton>
            <CheckBoxIcon></CheckBoxIcon>
          </IconButton>
        </NavLink>

        <NavLink to="/calendar">
          <IconButton>
            <CalendarMonthIcon></CalendarMonthIcon>
          </IconButton>
        </NavLink>

        <NavLink to="/focus">
          <IconButton>
            <AccessTimeIcon></AccessTimeIcon>
          </IconButton>
        </NavLink>

        <NavLink to="/statistics">
          <IconButton>
            <BarChartIcon></BarChartIcon>
          </IconButton>
        </NavLink>
      </Stack>

      <IconButton
        aria-label="account of current user"
        aria-controls="menu-account"
        onClick={handleMenu}
      >
        <AccountCircleIcon></AccountCircleIcon>
      </IconButton>

      <Menu
        id="menu-account"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout} component={Link} to={"/"} dense>
          Log out
        </MenuItem>
      </Menu>
    </Stack>
  );
}

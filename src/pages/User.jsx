import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";

import userService from "../services/userService";
import { Navigate } from "react-router-dom";

export default function User({ token, setToken }) {
  const [username, setUsername] = useState("public_user");
  const [password, setPassword] = useState("password");
  const [action, setAction] = useState("Log in");

  const linkButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "blue",
    display: "inline",
    margin: 0,
    padding: 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        action === "Log in"
          ? await userService.loginUser({ username, password })
          : await userService.createUser({ username, password });

      if (token) {
        setToken(token);
        localStorage.setItem("token", token);
        // console.log("token from User.js", token);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {token && <Navigate to="/home"></Navigate>}

      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockIcon></LockIcon>
      </Avatar>

      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          required
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
        ></TextField>
        <TextField
          fullWidth
          label="Password"
          value={password}
          type="password"
          required
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
        >
          {action}
        </Button>
      </Box>

      <Typography variant="body2" textAlign="center">
        Or{" "}
        <button
          style={linkButtonStyle}
          type="button"
          onClick={() => setAction(action === "Log in" ? "Sign up" : "Log in")}
        >
          {action === "Log in" ? "Sign up" : "Log in"}
        </button>{" "}
        with your own account
      </Typography>
    </Box>
  );
}

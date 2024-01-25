import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";

import userService from "../services/userService";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../reducers/tokenReducer";

export default function User() {
  const [username, setUsername] = useState("public_user");
  const [password, setPassword] = useState("pass");
  const [action, setAction] = useState("Log in");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

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
        dispatch(setToken(token));
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Grid container height="100vh">
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Grid>

      <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {token && <Navigate to="/lists"></Navigate>}

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
              sx={{ my: 2 }}
            >
              {action}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center">
            Or{" "}
            <button
              style={linkButtonStyle}
              type="button"
              onClick={() =>
                setAction(action === "Log in" ? "Sign up" : "Log in")
              }
            >
              {action === "Log in" ? "Sign up" : "Log in"}
            </button>{" "}
            with your own account
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

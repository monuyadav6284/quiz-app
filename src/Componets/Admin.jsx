import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Brightness4, WbSunny } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Monu from "./Monu";

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#1bbd7e",
    },
    background: {
      default: "#fff",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#1bbd7e",
    },
    background: {
      default: "#282c34",
    },
    mode: "dark",
  },
});

const Admin = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in from local storage
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };

  const avatarStyle = { backgroundColor: lightTheme.palette.primary.main };

  const btnstyle = { margin: "8px 0" };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = () => {
    if (username === "root" && password === "root") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true"); // Store login status in local storage
    } else {
      toast.error("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false"); // Update local storage on logout
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <ToastContainer />
      {!isLoggedIn ? (
        <div className="h-screen w-full bg-slate-600">
          <ThemeProvider theme={currentTheme}>
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton onClick={handleThemeToggle} color="inherit">
                {isDarkMode ? <Brightness4 /> : <WbSunny />}
              </IconButton>
            </div>
            <Grid container justifyContent="center">
              <Paper
                elevation={10}
                style={{
                  ...paperStyle,
                  backgroundColor: currentTheme.palette.background.default,
                }}
              >
                <Grid align="center">
                  <Avatar style={avatarStyle}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography variant="h5">Sign In</Typography>
                </Grid>
                <TextField
                  label="Username"
                  placeholder="Enter username"
                  fullWidth
                  required
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  fullWidth
                  required
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox name="checkedB" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={btnstyle}
                  fullWidth
                  onClick={handleSubmit}
                >
                  Sign in
                </Button>
              </Paper>
            </Grid>
          </ThemeProvider>
        </div>
      ) : (
        <>
          <Monu />
          <div style={{ position: "fixed", top: 10, right: 10 }}>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Admin;

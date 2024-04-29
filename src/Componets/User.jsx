import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreatePostMutation } from "../service/post";
import QuestionList from "../Componets/QuestionList";

function User() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [mutate] = useCreatePostMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    if (formData.fullname.length < 3) {
      toast.error("Fullname must be at least 3 characters long.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await mutate(formData);
      toast.success("Registration successful!");
      setFormData({
        fullname: "",
        email: "",
        password: "",
      });
      setIsAuthenticated(true);
    } catch (error) {
      toast.error("Failed to register. Please try again later.");
      console.error("Error:", error);
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression for validating email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const lightTheme = createTheme();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const currentTheme = darkMode ? darkTheme : lightTheme;

  if (isAuthenticated) {
    return <QuestionList />;
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <ToastContainer />
      <IconButton
        onClick={toggleTheme}
        sx={{ position: "fixed", top: 12, right: 16 }}
      >
        {darkMode ? <WbSunnyIcon /> : <Brightness2Icon />}
      </IconButton>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://www.thestatesman.com/wp-content/uploads/2018/01/kid.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        ></Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullname"
                label="Fullname"
                name="fullname"
                autoComplete="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default User;

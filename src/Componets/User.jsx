import * as React from "react";
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
  const [darkMode, setDarkMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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

  // Initialize the mutation hook
  const [mutate] = useCreatePostMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Validate form data
      if (!validateFormData()) {
        return;
      }

      // Send form data to the server
      await mutate(formData);
      // Display success message
      toast.success("Registration successful!");
      // Clear input fields
      setFormData({
        fullname: "",
        email: "",
        password: "",
      });
      // Set authentication status to true
      setIsAuthenticated(true);
    } catch (error) {
      // Display error message
      toast.error("Failed to register. Please try again later.");
      console.error("Error:", error);
    }
  };

  const validateFormData = () => {
    const { fullname, email, password } = formData;

    // Validate fullname
    if (fullname.length < 4) {
      toast.error("Fullname must be at least 4 characters long.");
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.");
      return false;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character."
      );
      return false;
    }

    return true;
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
              "url(https://media.istockphoto.com/id/1297580844/photo/medical-students-writing-examination-paper.webp?s=1024x1024&w=is&k=20&c=zebyqKqExOg-2KpLE5DNCW6bDcBMIWnGzssYLeW8U_8=)",
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
                error={
                  formData.fullname.length > 0 && formData.fullname.length < 4
                }
                helperText={
                  formData.fullname.length > 0 && formData.fullname.length < 4
                    ? "Fullname must be at least 4 characters long."
                    : ""
                }
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
                error={
                  formData.email.length > 0 &&
                  !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
                    formData.email
                  )
                }
                helperText={
                  formData.email.length > 0 &&
                  !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
                    formData.email
                  )
                    ? "Invalid email address."
                    : ""
                }
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
                error={
                  formData.password.length > 0 &&
                  !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/.test(
                    formData.password
                  )
                }
                helperText={
                  formData.password.length > 0 &&
                  !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/.test(
                    formData.password
                  )
                    ? "Password must be at least 6 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character."
                    : ""
                }
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

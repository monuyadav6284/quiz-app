import React from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import "../App.css";
import { useGetAllPostQuery } from "../service/post";
import {
  Brightness2 as MoonIcon,
  WbSunny as SunIcon,
} from "@mui/icons-material";

function UserList() {
  const { data: posts, error, isLoading } = useGetAllPostQuery();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress color="primary" size={64} thickness={4} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Variable to keep track of serial number
  let serialNumber = 1;

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          position: "relative",
          top: -10,
        }}
      >
        <IconButton onClick={toggleTheme} sx={{ position: "fixed", right: 16 }}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </IconButton>
        <TableContainer component={Paper} sx={{ marginTop: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>{" "}
                {/* Display Serial Number heading */}
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts &&
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{serialNumber++}</TableCell>{" "}
                    {/* Display Serial Number */}
                    <TableCell>{post.fullname}</TableCell>
                    <TableCell>{post.email}</TableCell>
                    <TableCell>{post.result}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  );
}

export default UserList;

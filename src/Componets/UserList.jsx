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
import { useGetAllResultsQuery } from "../service/result";
import {
  Brightness2 as MoonIcon,
  WbSunny as SunIcon,
} from "@mui/icons-material";

function UserList() {
  const { data: results, error, isLoading } = useGetAllResultsQuery();
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
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results &&
                results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{serialNumber++}</TableCell>{" "}
                    <TableCell>{result.userId.fullname}</TableCell>
                    <TableCell>{result.userId.email}</TableCell>
                    <TableCell>{result.result}</TableCell>
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

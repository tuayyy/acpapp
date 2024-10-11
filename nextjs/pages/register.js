import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AuthPage() {
  // Login states
  const [loginUsername, setLoginUsername] = useState(""); // Updated to username for login
  const [loginPassword, setLoginPassword] = useState("");

  // Register states
  const [registerUsername, setRegisterUsername] = useState(""); // Updated to username for register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername, // Updated to use username for login
          password_hash: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Store the logged-in user data in localStorage
      localStorage.setItem("user", JSON.stringify({ username: data.username }));

      // Redirect to the Test page or update the UI accordingly
      window.location.href = "/Restaurant"; // Assuming you want to navigate to the Test page after login
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerUsername, // Updated to use username for register
          email: registerEmail,
          password_hash: registerPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center" maxWidth="lg">
        {/* Login Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              padding: "30px",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#1976D2", mx: "auto", mb: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter your credentials to access your account
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#1976D2",
                  color: "#fff",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Register Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              padding: "30px",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#388E3C", mx: "auto", mb: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                Register
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create a new account to get started
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleRegisterSubmit}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: "#388E3C",
                  color: "#fff",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                Register
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
}
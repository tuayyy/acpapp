import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // Import the basket icon
import useBearStore from "@/store/useBearStore";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles"; // Import styled

// Styled Button for the Restaurant link
const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: "16px", // Set a smaller font size
  fontWeight: 600, // Make text bolder
  padding: "8px 16px", // Adjust padding for a smaller button
  margin: "0 10px", // Add margin
  borderRadius: "30px", // Rounded corners
  color: "#ffffff",
  backgroundColor: "#ff5e15", // Set a custom background color
  "&:hover": {
    backgroundColor: "#e55e15", // Darker shade on hover
  },
}));

// Styled Typography for the App Name
const AppName = styled(Typography)(({ theme }) => ({
  fontSize: "24px", // Increased font size
  fontWeight: 700, // Make it bold
  color: "#ffffff",
  padding: "0 10px",
  fontFamily: "Prompt",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Add a subtle shadow
}));

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);

  // State to store user email (if logged in)
  const [userEmail, setUserEmail] = useState("");

  // Retrieve user email from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      setUserEmail(storedUser.email);
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    // Clear user data from localStorage and state
    localStorage.removeItem("user");
    setUserEmail(""); // Clear user email from state
    router.push("/"); // Redirect to login page
  };

  // Render main layout if the route is not the root
  if (router.pathname === "/") {
    return <main>{children}</main>;
  }

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "rgba(255, 111, 105, 0.7)" }}>
        <Toolbar>
          {/* Application Name or Logo */}
          <AppName>
            Truck Truck
          </AppName>

          <div style={{ flexGrow: 1 }} />

          {/* Centered Navigation Links */}
          <Link href="/Restaurant" passHref>
            <StyledButton>Restaurant</StyledButton>
          </Link>

          {/* Dashboard Navigation Button */}
          <Link href="/dashboard" passHref>
            <StyledButton>Dashboard</StyledButton>
          </Link>

          {/* Basket Icon with Link */}
          <Link href="/basket">
            <IconButton color="inherit">
              <ShoppingBasketIcon />
            </IconButton>
          </Link>

          {/* User Email and Logout Button */}
          {userEmail ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ color: "#ffffff", marginRight: "10px" }}>
                {userEmail}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}

          {/* Profile Button */}
          <Button
            color="inherit"
            onClick={() => {
              router.push("/profile");
            }}
          >
            <PersonIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

// Component for navigation links
const NavigationLink = ({ href, label }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px", // Add padding on left and right
        }}
      >
        {label}
      </Typography>
    </Link>
  );
};

export default NavigationLayout;

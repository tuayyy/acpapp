import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import useBearStore from "@/store/useBearStore";
import { useEffect, useState } from "react";

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
          <Typography
            variant="body1"
            sx={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Prompt",
            }}
          >
            {/* {appName} */}
            TruckTruck
          </Typography>

          {/* Navigation Links */}
          <NavigationLink href="/Restaurant" label="Restaurant" />
          <div style={{ flexGrow: 1 }} />

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
            <Button color="inherit" onClick={() => router.push("/")}>
              Login
            </Button>
          )}

          {/* Modified Profile Button with Icon to redirect to /test */}
          <Button
            color="inherit"
            onClick={() => {
              router.push("/test");
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

import React from "react";
import { Box, Typography, Stack,TextField ,Button} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";



export default function Test() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginUsername, setLoginUsername] = useState('')
    const router = useRouter();
  
    // Function to handle login submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: loginEmail,
              password_hash: loginPassword,
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          }
    
          const data = await response.json();
          setErrorMessage('Login successful!');
    
          // Redirect to page1 after successful login
          router.push("/Restaurant"); // Redirect to /page1 upon success
        } catch (error) {
          setErrorMessage(error.message);
        }
      };

    return (
    
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        pt: 4,
        bgcolor: "#F9E79F", // Set a light yellow background color
      }}
    >
      <Box
        sx={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "#a7ddc4", // Circle background color
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          textAlign: "center",
          position: "relative",
          top: 30 // Needed for absolute positioning of children

        }}
      >
        <Box position="relative">

          {/* Overlayed Typography */}
          <Typography
            component="span"
            fontSize={50}
            fontFamily="fantasy"
            fontStyle="italic"
            sx={{
              color: "#ff6f69",
              position: "absolute", // Position it on top
              zIndex: 2, // Higher zIndex to stay on top
              top: -40,
              left: "-50px",
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            TRUCK
          </Typography>

          {/* Second Typography with Background and Border */}
          <Typography
            component="span"
            fontSize={55}
            fontFamily="fantasy"
            fontStyle="italic"
            sx={{
              color: "	#ffcc5c", // Transparent text so only border shows

              position: "absolute", // Position it on top
              zIndex: 1, // Lower zIndex to stay behind the first text
              top: -40,
              left: "-20px",
              right: 0,
              bottom: 0,
              justifyContent: "center",

              transform: "translate(-70%, -50%)", // Adjust for centering
              display: "flex",

            }}
          >
            TRUCK
          </Typography>
          <Typography
            component="span"
            fontSize={50}
            fontFamily="fantasy"
            fontStyle="italic"
            sx={{
              color: "#86c5a6",
              position: "absolute", // Position it on top
              zIndex: 2, // Higher zIndex to stay on top
              top: 40,
              left: "25px",
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            TRUCK
          </Typography>

          {/* Second Typography with Background and Border */}
          <Typography
            component="span"
            fontSize={55}
            fontFamily="fantasy"
            fontStyle="italic"
            sx={{
              color: "	#ffcc5c", // Transparent text so only border shows

              position: "absolute", // Position it on top
              zIndex: 1, // Lower zIndex to stay behind the first text
              top: 0,
              left: "25px",
              right: 0,
              bottom: 0,
              justifyContent: "center",

              display: "flex",

            }}
          >
            TRUCK
          </Typography>
          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
          <Typography
          color = '#ff6f69'
          sx = {{position: 'absolute',top:200,left:'-20px',fontWeight: 'BOLD'}}>
            Email
          </Typography>
          <TextField 
          height = '120vh'
          variant = 'standard'
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          sx = {{position: "absolute",
            width : '45ch',
            bgcolor: '#c9f1f2',
            left:'-310px',
            borderRadius:'25px',
            border: "2px solid transparent",

            top: 230,
            m:0.1
          }}>

          </TextField>
          <Typography
          color = '#ff6f69'

          sx = {{position: 'absolute',top:300,left:'-32px',fontWeight: 'BOLD'}}>
            Password
          </Typography>
          <TextField 
          height = '120vh'
          variant = 'standard'
          type = 'password'
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          sx = {{position: "absolute",
            width : '45ch',
            bgcolor: '#c9f1f2',
            left:'-310px',
            borderRadius:'25px',
            border: "2px solid transparent",

            top: 330,
            m:0.1
          }}>

          </TextField>
          {/* Submit Login Button */}
          <Button variant="contained"
          type="submit"
          sx = {{position : 'absolute',top:450,left:'-100px',bgcolor:'#ff6f69'}}>
        LOGIN
        </Button>
        </form>

        <Button variant="contained"
          sx = {{position : 'absolute',top:450,left:'-10px',bgcolor:'#96ceb4'}}>
        <Link href="/register">REGISTER</Link>
        </Button>
        {/* Display error or success message */}
        {errorMessage && (
            <Typography
              sx={{
                color: "red",
                position: "absolute",
                top: 500,
                left: "-310px",
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}


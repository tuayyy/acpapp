// components/ProfileCard.js
import React from 'react';
import { Card, CardContent, CardHeader, Avatar, Typography, Divider, Grid, Box } from '@mui/material';
import { styled } from '@mui/system';

// Styled card component with increased size and minimal layout
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800, // Increase the width for a CV-like appearance
  margin: '50px auto',
  padding: '20px',
  backgroundColor: theme.palette.background.paper,
}));

const ProfileCard = () => {
  return (
    <StyledCard>
      {/* Header Section */}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#182b3b', width: 80, height: 80 }}>
            {/* Replace with user's initial or avatar image */}
            JD
          </Avatar>
        }
        title={
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            John Doe
          </Typography>
        }
        subheader={
          <Typography variant="h6" component="h2" sx={{ color: 'gray' }}>
            Frontend Developer
          </Typography>
        }
      />

      {/* Divider to separate header from content */}
      <Divider sx={{ marginY: 2 }} />

      {/* Content Section */}
      <CardContent>
        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={4}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              Contact Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
              Email: johndoe@example.com
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
              Phone: +1234567890
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
              LinkedIn: linkedin.com/in/johndoe
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
              Location: New York, USA
            </Typography>
          </Grid>

          {/* Right Section */}
          <Grid item xs={8}>
            {/* Placeholder for Additional Information */}
            <Box sx={{ height: '200px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                Summary
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                This is a placeholder for your summary or introduction. You can write a brief paragraph here about your skills, experiences, and background. 
                Add more information later as needed.
              </Typography>
            </Box>

            {/* Additional Empty Sections for Future Content */}
            <Box sx={{ height: '100px', marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                Experience
              </Typography>
            </Box>

            <Box sx={{ height: '100px', marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                Skills
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileCard;

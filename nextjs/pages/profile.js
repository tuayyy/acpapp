import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  width: '60vw',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

export default function Profile() {
  const [profileData, setProfileData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // New state to track errors

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const username = storedUser?.username || '';

    if (username) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/profile/${username}`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          } else {
            const errorDetail = await response.json();
            setError(`Failed to fetch profile: ${errorDetail.detail}`);
            console.error('Failed to fetch profile data:', errorDetail);
          }
        } catch (error) {
          setError('Error fetching profile data.');
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
      setError('No username found in localStorage.');
      console.error('No username found in localStorage.');
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <ProfilePaper elevation={3}>
          <Stack
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{ marginTop: 4 }}
          >
            <Avatar
              sx={{ width: 100, height: 100, bgcolor: '#3f51b5', fontSize: 40 }}
            >
              {profileData.username ? profileData.username.charAt(0).toUpperCase() : ''}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {profileData.username || 'User'}
            </Typography>
            <Typography variant="h6" sx={{ color: 'gray' }}>
              {profileData.email || 'No Email Provided'}
            </Typography>
          </Stack>

          <Divider sx={{ width: '80%', marginY: 4 }} />
          <Typography variant="body1" sx={{ color: 'gray' }}>
            More details and charts will be displayed here...
          </Typography>
        </ProfilePaper>
      )}
    </Box>
  );
}

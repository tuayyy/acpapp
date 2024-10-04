import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, Box, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled(Container)({
  marginTop: '50px',
  padding: '20px',
  backgroundColor: '#f4f6f8',
  borderRadius: '10px',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#182b3b',
  marginBottom: '10px',
});

const SectionContent = styled(Box)({
  marginBottom: '20px',
});

const PlaceholderText = styled(Typography)({
  fontSize: '1rem',
  color: '#777',
});

const ProfilePaper = styled(Paper)({
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
});

export default function Profile() {
  const [userEmail, setUserEmail] = useState(''); // State to store the user's email

  // Retrieve the email from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setUserEmail(storedUser.email);
    }
  }, []);

  return (
    <ProfileContainer maxWidth="md">
      {/* Profile Header */}
      <ProfilePaper elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Avatar
              alt="Profile Image"
              src="/static/images/avatar/1.jpg" // Replace with your image
              sx={{ width: 120, height: 120, margin: '0 auto' }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {/* Display the user's email instead of the placeholder text */}
            <Typography variant="h4" sx={{ color: '#182b3b' }}>
              {userEmail || 'No Email Provided'}
            </Typography>
            <Typography variant="h6" sx={{ color: '#555' }}>
              Your Profession (e.g., Software Developer)
            </Typography>
            <PlaceholderText sx={{ marginTop: '10px' }}>
              Brief introduction about yourself. Write a few lines to describe your background, interests, and goals.
            </PlaceholderText>
          </Grid>
        </Grid>
      </ProfilePaper>

      <Divider sx={{ marginY: '20px' }} />

      {/* Sections */}
      <SectionContent>
        <SectionTitle>Education</SectionTitle>
        <PlaceholderText>Include your educational background, degrees, and institutions here.</PlaceholderText>
      </SectionContent>

      <SectionContent>
        <SectionTitle>Experience</SectionTitle>
        <PlaceholderText>Describe your professional experience, job titles, companies, and responsibilities here.</PlaceholderText>
      </SectionContent>

      <SectionContent>
        <SectionTitle>Skills</SectionTitle>
        <PlaceholderText>Add your key skills, technologies, or areas of expertise.</PlaceholderText>
      </SectionContent>

      <SectionContent>
        <SectionTitle>Projects</SectionTitle>
        <PlaceholderText>Highlight your significant projects, achievements, or contributions.</PlaceholderText>
      </SectionContent>

      <SectionContent>
        <SectionTitle>Certifications</SectionTitle>
        <PlaceholderText>List any relevant certifications, courses, or training.</PlaceholderText>
      </SectionContent>

      <SectionContent>
        <SectionTitle>Contact Information</SectionTitle>
        <PlaceholderText>Email: {userEmail ? userEmail : 'your.email@example.com'}</PlaceholderText>
        <PlaceholderText>Phone: (123) 456-7890</PlaceholderText>
        <PlaceholderText>LinkedIn: linkedin.com/in/yourprofile</PlaceholderText>
      </SectionContent>
    </ProfileContainer>
  );
}

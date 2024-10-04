import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  styled,
  Paper,
  Rating,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Import InfoIcon

// Define the styled Item component
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  flexGrow: 1,
  width: '100%',
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
}));

export default function Kfc() {
  // State to keep track of the rating value
  const [rating, setRating] = useState(3); // Default rating set to 3

  return (
    <Box
      sx={{
        position: 'relative',
        height: '250vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* Image as a background layer */}
      <img
        src="https://www.derwesten.de/wp-content/uploads/sites/8/2023/10/imago0302043723h-e1696481879718.jpg"
        alt="Mcdonald"
        style={{
          width: '80%',
          height: '80%',
          objectFit: 'cover',
          position: 'absolute',
          left: 150,
          zIndex: 0,
        }}
      />

      {/* Yellow Box positioned on top of the image */}
      <Box
        sx={{
          backgroundColor: 'rgba(255,204,92,0.8)',
          width: 500,
          height: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 400, // Set top position of the yellow box
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          borderRadius: 10,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          padding: 3, // Add padding for inner spacing
        }}
      >
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="column"
          useFlexGap
          sx={{
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
          }}
        >
          {/* Title Item */}
          <Item>
            <Typography variant="h4" sx={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold' }}>
              Mcdonald
            </Typography>
          </Item>

          {/* Coupon Item */}
          <Item>Coupon: 0</Item>

          {/* Rating Item with Star Rating */}
          <Item>
            <Typography variant="body1" sx={{ textAlign: 'left', marginBottom: '8px' }}>
              Rating:
            </Typography>
            <Rating
              name="kfc-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue); // Update the state with the new rating
              }}
              precision={0.5} // Allow half-star ratings
              size="large" // Set the size of the stars
              sx={{ color: '#ffcc00' }} // Customize the star color
            />
          </Item>
        </Stack>
      </Box>

      {/* Menu & Prices Section */}
      <Box
        sx={{
          position: 'relative',
          top: 800, // Move Menu & Prices section closer to the yellow box
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,204,92,0.8)', // Set background color
          width: 300, // Set width of the background box
          padding: 2, // Add padding for inner spacing
          borderRadius: 5, // Add rounded corners
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Add shadow for better visibility
          zIndex: 2, // Ensure it appears above other elements
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Menu & Prices:
        </Typography>
      </Box>

      {/* Image List Section */}
      <ImageList
        sx={{
          width: 800,
          height: 800,
          position: 'relative',
          top: 850, // Move Image List section closer to the yellow box and Menu & Prices
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // 70% opaque white background
          padding: 2, // Optional padding inside the ImageList
          borderRadius: 5, // Add rounded corners
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Add shadow for better visibility
        }}
        cols={3} // Set the number of columns to 3 for uniform spacing
        gap={10} // Set the gap between images
      >
        <ImageListItem key="Subheader" cols={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
          <ListSubheader component="div">Menu Gallery</ListSubheader>
        </ImageListItem>
        {itemData.map((item) => (
          <ImageListItem key={item.img} sx={{ height: '200px' }}> {/* Set a fixed height for all items */}
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%', // Ensure each image takes the full width of its container
                height: '100%', // Set each image to have a consistent height
                objectFit: 'cover', // Maintain aspect ratio and cover the entire space
                borderRadius: '8px', // Optional: Add rounded corners to the images
              }}
            />
            <ImageListItemBar
              title={item.title || 'KFC Item'}
              subtitle={item.price || 'KFC Menu'}
              actionIcon={
                <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} aria-label={`info about ${item.title || 'KFC Item'}`}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: 'https://kfcbd.com/storage/products/k8kyCyznKk5bG75XFqUJXsNlO.jpg',
    title: 'Fried Chicky Chick',
    price: '2000 dollars',
  },
  {
    img: 'https://www.kfc-suisse.ch/fileadmin/_processed_/c/a/csm_webseite_desktop-classic-original_538dd9e0dd.jpg',
    title: 'Wopper Wopper Wopper',
    price: '69 dollars',
  },
  {
    img: 'https://media-cldnry.s-nbcnews.com/image/upload/newscms/2019_36/1478740/kfc_fries_international_main.jpg',
    title: 'Fried Chicky Chick',
    price: '2000 dollars',
  },
  {
    img: 'https://www.coca-cola.com/content/dam/onexp/sg/en/home-images/media-center/kfc/kfc-5pcs-satay-crunch-buddy-meal-with-coca-cola-zero-sugar-credit-kfc-singapore.png',
    title: 'Coke',
    price: '19 dollars',
  },
];

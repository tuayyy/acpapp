import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  styled,
  Paper,
  ImageList,
  ImageListItem,
  ListSubheader,
  IconButton,
  Badge,
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'; // Import the basket icon
import { useRouter } from 'next/router';

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

export default function Mcdonalds() {
  const [rating, setRating] = useState(4); // Default rating set to 4
  const [basketCount, setBasketCount] = useState(0); // State for the basket count
  const router = useRouter(); // Initialize useRouter for navigation

  // Load basket count from localStorage on initial render
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('basketItems')) || [];
    setBasketCount(items.length);

    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'basketUpdated') {
        // Reload basket count when basketUpdated flag changes
        const updatedItems = JSON.parse(localStorage.getItem('basketItems')) || [];
        setBasketCount(updatedItems.length);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to handle adding items to the basket
  const addToBasket = (item) => {
    const basketItems = JSON.parse(localStorage.getItem('basketItems')) || [];
    const basketItem = {
      title: item.title,
      price: item.price,
    };
    basketItems.push(basketItem);
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    setBasketCount(basketItems.length); // Update the basket count

    // Notify other pages that the basket has been updated
    localStorage.setItem('basketUpdated', Date.now().toString()); // Use timestamp to force change detection
  };

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
              McDonald's Menu
            </Typography>
          </Item>

          {/* Coupon Item */}
          <Item>Coupon: 0</Item>
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
          <ImageListItem key={item.img} sx={{ height: '300px' }}> {/* Set a fixed height for all items */}
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%', // Ensure each image takes the full width of its container
                height: '70%', // Set each image to have a consistent height
                objectFit: 'cover', // Maintain aspect ratio and cover the entire space
                borderRadius: '8px', // Optional: Add rounded corners to the images
              }}
            />
            {/* Item Name and Price */}
            <Typography variant="h6" sx={{ marginTop: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {item.title}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 1 }}>
              {item.price}
            </Typography>
            {/* Basket Icon Button */}
            <IconButton
              onClick={() => addToBasket(item)}
              color="secondary"
              sx={{ display: 'block', margin: '0 auto', marginBottom: '10px' }}
            >
              <ShoppingBasketIcon />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Go to Basket Button with Badge */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 50,
          zIndex: 10,
        }}
      >
        <Badge badgeContent={basketCount} color="error">
          <IconButton
            onClick={() => router.push('/basket')}
            color="primary"
            sx={{ padding: '20px' }}
          >
            <ShoppingBasketIcon sx={{ fontSize: '30px' }} />
          </IconButton>
        </Badge>
      </Box>
    </Box>
  );
}

// Define menu items for the McDonald's page
const itemData = [
  {
    img: 'https://japantoday-asset.scdn3.secure.raxcdn.com/img/store/04/19/5cbd7fc474c436ad61070a41d7134cf32da9/SamuraiMac21_top/_w1700.jpg',
    title: 'Mac Samurai Burger',
    price: '9.99 dollars',
  },
  {
    img: 'https://ceres.shop/product_images/uploaded_images/heres-why-mcdonalds-hamburgers-dont-decompose.png',
    title: 'MacFries',
    price: '3.49 dollars',
  },
  {
    img: 'https://www.foodandwine.com/thmb/25k7IDKxNPJ9jHSHgBcLSZ5S_lc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Spicy-McNuggets-Are-Back-at-McDonalds-FT-BLOG0923-43139bdeb0874fc59af1abd48e5c5e34.jpg',
    title: 'MacNuggets',
    price: '5.59 dollars',
  },
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmZwiF8r8phQciWpMX5qc5F1VTtuBJL0IDKA&s',
    title: 'MacCoca Cola',
    price: '2.19 dollars',
  },
];

// basket.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, IconButton, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Basket() {
  const [basketItems, setBasketItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0); // State for total cost
  const router = useRouter();

  // Function to load basket items from localStorage and group them by title
  const loadBasketItems = () => {
    const items = JSON.parse(localStorage.getItem('basketItems')) || [];
    const groupedItems = groupItems(items);
    setBasketItems(groupedItems);

    // Calculate total cost
    const total = groupedItems.reduce((acc, item) => {
      const price = parseFloat(item.price.replace('$', '')); // Remove '$' and convert to number
      return acc + price * item.quantity;
    }, 0);
    setTotalCost(total); // Update total cost state
  };

  // Group items by title and calculate quantity
  const groupItems = (items) => {
    const grouped = items.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.title === item.title);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    return grouped;
  };

  useEffect(() => {
    // Initial load of basket items and cost
    loadBasketItems();

    // Add an event listener for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'basketItems') {
        loadBasketItems(); // Reload items and cost when localStorage is updated
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Increase item quantity and update localStorage
  const increaseQuantity = (title) => {
    const updatedItems = basketItems.map((item) => {
      if (item.title === title) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateBasket(updatedItems);
  };

  // Decrease item quantity and update localStorage
  const decreaseQuantity = (title) => {
    const updatedItems = basketItems
      .map((item) => {
        if (item.title === title && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
    updateBasket(updatedItems);
  };

  // Update basket in state and localStorage
  const updateBasket = (items) => {
    setBasketItems(items);
    localStorage.setItem('basketItems', JSON.stringify(flattenItems(items)));
    calculateTotalCost(items);

    // Notify other pages that the basket has been updated
    localStorage.setItem('basketUpdated', Date.now().toString()); // Use timestamp to force change detection
  };

  // Flatten grouped items to save in localStorage
  const flattenItems = (items) => {
    return items.flatMap((item) => Array(item.quantity).fill({ title: item.title, price: item.price }));
  };

  // Calculate total cost based on basket items
  const calculateTotalCost = (items) => {
    const total = items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return acc + price * item.quantity;
    }, 0);
    setTotalCost(total);
  };

  // Clear Basket function
  const clearBasket = () => {
    setBasketItems([]); // Clear state
    setTotalCost(0); // Clear total cost
    localStorage.removeItem('basketItems'); // Remove from local storage

    // Set basketUpdated flag to indicate changes
    localStorage.setItem('basketUpdated', Date.now().toString()); // Use timestamp to force change detection
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Basket</Typography>

      {/* Display total item count */}
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        Total Unique Items: {basketItems.length}
      </Typography>

      {/* Display basket items */}
      <List>
        {basketItems.length > 0 ? (
          basketItems.map((item, index) => (
            <ListItem key={index} sx={{ backgroundColor: '#ffffff', marginBottom: '10px', borderRadius: '4px' }}>
              {/* Display the title, price, and quantity */}
              <ListItemText
                primary={`${item.title} - $${item.price}`}
                secondary={`Quantity: ${item.quantity}`}
              />
              {/* Increase and Decrease Buttons */}
              <IconButton onClick={() => decreaseQuantity(item.title)} aria-label="remove">
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ marginX: '10px' }}>{item.quantity}</Typography>
              <IconButton onClick={() => increaseQuantity(item.title)} aria-label="add">
                <AddIcon />
              </IconButton>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No items in the basket.</Typography>
        )}
      </List>

      {/* Divider for better separation */}
      <Divider sx={{ marginY: 2 }} />

      {/* Display total cost */}
      {basketItems.length > 0 && (
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Total Payment: ${totalCost.toFixed(2)}
        </Typography>
      )}

      {/* Clear Basket button */}
      {basketItems.length > 0 && (
        <Button variant="contained" color="secondary" onClick={clearBasket} sx={{ marginTop: '20px' }}>
          Clear Basket
        </Button>
      )}

      {/* Back to Home button */}
      <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ marginTop: '20px', marginLeft: '10px' }}>
        Back to Home
      </Button>
    </Box>
  );
}

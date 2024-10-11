// basket.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, IconButton, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Basket() {
  const [basketItems, setBasketItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [restaurantId, setRestaurantId] = useState(null); // State for restaurant_id
  const router = useRouter();

  // Load basket items and set restaurant_id based on localStorage
  const loadBasketItems = () => {
    const items = JSON.parse(localStorage.getItem('basketItems')) || [];
    const storedRestaurantId = localStorage.getItem('restaurant_id'); // Retrieve restaurant_id from localStorage
    setRestaurantId(storedRestaurantId ? parseInt(storedRestaurantId, 10) : null);

    const groupedItems = groupItems(items);
    setBasketItems(groupedItems);

    const total = groupedItems.reduce((acc, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return acc + price * item.quantity;
    }, 0);
    setTotalCost(total);
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
    loadBasketItems();

    const handleStorageChange = (event) => {
      if (event.key === 'basketItems' || event.key === 'restaurant_id') {
        loadBasketItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const increaseQuantity = (title) => {
    const updatedItems = basketItems.map((item) => {
      if (item.title === title) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateBasket(updatedItems);
  };

  const decreaseQuantity = (title) => {
    const updatedItems = basketItems
      .map((item) => {
        if (item.title === title && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateBasket(updatedItems);
  };

  const updateBasket = (items) => {
    setBasketItems(items);
    localStorage.setItem('basketItems', JSON.stringify(flattenItems(items)));
    calculateTotalCost(items);
  };

  const flattenItems = (items) => {
    return items.flatMap((item) => Array(item.quantity).fill({ title: item.title, price: item.price }));
  };

  const calculateTotalCost = (items) => {
    const total = items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return acc + price * item.quantity;
    }, 0);
    setTotalCost(total);
  };

  const clearBasket = () => {
    setBasketItems([]);
    setTotalCost(0);
    localStorage.removeItem('basketItems');
    localStorage.removeItem('restaurant_id'); // Clear restaurant_id on basket clear
  };

  // Function to submit the order to the backend
  const submitOrder = async () => {
    try {
      if (!restaurantId) {
        alert("Unknown restaurant. Cannot submit order.");
        return;
      }

      for (const item of basketItems) {
        const response = await fetch('http://localhost:8000/api/add_order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant_id: restaurantId,  // Use the detected restaurant_id
            menu_item: item.title,
            quantity: item.quantity,
            price: parseFloat(item.price.replace('$', '')),
            total_price: parseFloat(item.price.replace('$', '')) * item.quantity,
          }),
        });

        // Check for response status
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to submit order:", errorData);
          alert(`Failed to submit order: ${errorData.detail}`);
          return;
        }

        const result = await response.json();
        console.log(result.message);
      }
      alert("Order submitted successfully!");
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Basket</Typography>
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>Restaurant ID: {restaurantId}</Typography> {/* Display Restaurant ID */}
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>Total Unique Items: {basketItems.length}</Typography>
      <List>
        {basketItems.length > 0 ? (
          basketItems.map((item, index) => (
            <ListItem key={index} sx={{ backgroundColor: '#ffffff', marginBottom: '10px', borderRadius: '4px' }}>
              <ListItemText primary={`${item.title} - ${item.price}`} secondary={`Quantity: ${item.quantity}`} />
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
      <Divider sx={{ marginY: 2 }} />
      {basketItems.length > 0 && (
        <Typography variant="h6" sx={{ marginBottom: '20px' }}>Total Payment: ${totalCost.toFixed(2)}</Typography>
      )}
      {basketItems.length > 0 && (
        <Button variant="contained" color="secondary" onClick={clearBasket} sx={{ marginTop: '20px' }}>
          Clear Basket
        </Button>
      )}
      <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ marginTop: '20px', marginLeft: '10px' }}>
        Back to Home
      </Button>
      {basketItems.length > 0 && (
        <Button variant="contained" color="primary" onClick={submitOrder} sx={{ marginTop: '20px', marginLeft: '10px' }}>
          Submit Order
        </Button>
      )}
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const ProfileContainer = styled(Container)({
  padding: '20px',
  backgroundColor: '#f4f6f8',
  borderRadius: '10px',
});

const DashboardTitle = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#1976D2',
  textAlign: 'center',
  marginBottom: '30px',
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

// Custom PieChart component
function PieChart({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativeAngle = 0;

  const getPieSlices = () => {
    return data.map((item, index) => {
      const angle = (item.value / total) * 360;
      const x1 = Math.cos((cumulativeAngle * Math.PI) / 180);
      const y1 = Math.sin((cumulativeAngle * Math.PI) / 180);
      cumulativeAngle += angle;
      const x2 = Math.cos((cumulativeAngle * Math.PI) / 180);
      const y2 = Math.sin((cumulativeAngle * Math.PI) / 180);
      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      const fillColor = `hsl(${index * 360 / data.length}, 70%, 50%)`;

      return (
        <path
          key={index}
          d={pathData}
          fill={fillColor}
          stroke="#ffffff"
          strokeWidth="0.01"
          data-label={`${item.label}: ${(item.value / total * 100).toFixed(2)}%`}
        />
      );
    });
  };

  return (
    <svg viewBox="-1 -1 2 2" width="300" height="300">
      {getPieSlices()}
    </svg>
  );
}

// Custom BarChart component with quantity labels and color legend
function BarChart({ data }) {
  const maxQuantity = Math.max(...data.map((item) => item.value));
  const barWidth = 100 / data.length;

  return (
    <svg viewBox="0 0 100 50" width="300" height="150">
      {data.map((item, index) => {
        const barHeight = (item.value / maxQuantity) * 40;
        const x = index * barWidth + 2;
        const y = 50 - barHeight;
        const fillColor = `hsl(${index * 360 / data.length}, 70%, 50%)`;

        return (
          <g key={index}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth - 4}
              height={barHeight}
              fill={fillColor}
            />
            {/* Label above each bar */}
            <text x={x + (barWidth - 4) / 2} y={y - 2} fontSize="2" textAnchor="middle">
              {item.value}
            </text>
            {/* Menu item name below each bar */}
            <text x={x + (barWidth - 4) / 2} y="52" fontSize="2" textAnchor="middle">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Legend component for Pie and Bar Charts
function Legend({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Box sx={{ textAlign: 'left', mt: 2 }}>
      {data.map((item, index) => {
        const color = `hsl(${index * 360 / data.length}, 70%, 50%)`;
        const percentage = ((item.value / total) * 100).toFixed(2);
        return (
          <Box key={index} display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                display: 'inline-block',
                marginRight: '8px',
              }}
            />
            <Typography variant="body1" component="span">
              {item.label}: {percentage}%
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// Main Profile Component
export default function Profile() {
  const [foodOrders, setFoodOrders] = useState([]); // State to store food orders

  // Fetch food orders from the backend API when the component mounts
  useEffect(() => {
    fetchFoodOrders();

    // Auto-refresh the table every 5 seconds
    const interval = setInterval(() => {
      fetchFoodOrders();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to fetch food orders from the backend API
  const fetchFoodOrders = async () => {
    try {
      const response = await fetch('/api/food_orders'); // Replace with your backend API endpoint
      if (response.ok) {
        const data = await response.json();
        setFoodOrders(data.food_orders || []); // Set food orders or an empty array if undefined
      } else {
        console.error('Failed to fetch food orders');
      }
    } catch (error) {
      console.error('Error fetching food orders:', error);
    }
  };

  // Prepare data for the charts
  const prepareQuantityChartData = () => {
    const itemQuantities = foodOrders.reduce((acc, order) => {
      acc[order.menu_item] = (acc[order.menu_item] || 0) + order.quantity;
      return acc;
    }, {});

    return Object.entries(itemQuantities).map(([label, value]) => ({
      label,
      value,
    }));
  };

  // Check if there is data to display
  const hasData = foodOrders && foodOrders.length > 0;

  return (
    <Box>
      {/* Dashboard Title */}
      <DashboardTitle>Dash Board</DashboardTitle>

      <ProfileContainer>
        <Grid container spacing={3}>
          {/* Pie Chart Section */}
          <Grid item xs={12} md={6}>
            <ProfilePaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Food Popularity Chart (Pie)
              </Typography>
              {hasData ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <PieChart data={prepareQuantityChartData()} />
                  <Legend data={prepareQuantityChartData()} />
                </Box>
              ) : (
                <PlaceholderText>No food orders found.</PlaceholderText>
              )}
            </ProfilePaper>
          </Grid>

          {/* Bar Chart Section */}
          <Grid item xs={12} md={6}>
            <ProfilePaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quantity per Menu Item (Bar)
              </Typography>
              {hasData ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <BarChart data={prepareQuantityChartData()} />
                  <Legend data={prepareQuantityChartData()} /> {/* Color Legend for Bar Chart */}
                </Box>
              ) : (
                <PlaceholderText>No food orders found.</PlaceholderText>
              )}
            </ProfilePaper>
          </Grid>

          {/* Food Orders Table Section */}
          <Grid item xs={12}>
            <ProfilePaper>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Food Orders Table
              </Typography>
              {hasData ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Restaurant ID</TableCell>
                      <TableCell>Menu Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Total Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {foodOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.restaurant_id}</TableCell>
                        <TableCell>{order.menu_item}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.price}</TableCell>
                        <TableCell>{order.total_price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <PlaceholderText>No food orders found.</PlaceholderText>
              )}
            </ProfilePaper>
          </Grid>
        </Grid>
      </ProfileContainer>
    </Box>
  );
}

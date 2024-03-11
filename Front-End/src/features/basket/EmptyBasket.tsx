import React from 'react';
import { Typography, Box, Grid, Paper } from '@mui/material';

const EmptyBasketMessage = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" minHeight="80vh">
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box textAlign="center">
            <Typography variant="h4" color="textPrimary" gutterBottom>
              Your Basket is Empty
            </Typography>
            <Typography variant="body1" color="textSecondary">
              It seems like you haven't added any products to your basket yet.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmptyBasketMessage;
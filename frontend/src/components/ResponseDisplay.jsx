import React from 'react';
import { Paper, Typography, CircularProgress, Box } from '@mui/material';

const ResponseDisplay = ({ response, loading }) => {
  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Answer:
      </Typography>
      <Box sx={{ minHeight: '100px' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <Typography>{response}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ResponseDisplay;
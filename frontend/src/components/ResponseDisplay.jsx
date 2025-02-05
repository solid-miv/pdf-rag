import React from 'react';
import { Paper, Typography, CircularProgress, Box, Alert, Fade } from '@mui/material';

const ResponseDisplay = ({ response, loading }) => {
  const isWarningMessage = response && response.includes("Please upload some documents first");
  
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
        ) : isWarningMessage ? (
          <Fade in={true} timeout={500}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {response}
            </Alert>
          </Fade>
        ) : (
          <Typography>{response}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ResponseDisplay;
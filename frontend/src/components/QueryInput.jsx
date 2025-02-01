import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const QueryInput = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastQuery(query);
    onSubmit(query);
    setQuery('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your question..."
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        sx={{ mb: 2 }}
      >
        Ask Question
      </Button>
      {lastQuery && (
        <Typography variant="body2" color="text.secondary">
          Last question: {lastQuery}
        </Typography>
      )}
    </Box>
  );
};

export default QueryInput;
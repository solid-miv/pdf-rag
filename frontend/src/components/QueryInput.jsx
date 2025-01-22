import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const QueryInput = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
      >
        Ask Question
      </Button>
    </Box>
  );
};

export default QueryInput;
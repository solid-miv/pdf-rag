import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const models = {
  llama: {
    label: 'LLaMA 70B'
  },
  mixtral: {
    label: 'Mixtral 8x7B'
  },
  gemma: {
    label: 'Gemma 9B'
  }
};

const ModelSelector = ({ selectedModel, onModelChange }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Model</InputLabel>
        <Select
          value={selectedModel}
          label="Model"
          onChange={(e) => onModelChange(e.target.value)}
        >
          {Object.entries(models).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ModelSelector;
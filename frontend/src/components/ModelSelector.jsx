import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip } from '@mui/material';

const models = {
  llama: {
    label: 'LLaMA 70B',
    info: 'Developed by Meta AI. A powerful open-source language model with 70B parameters, optimized for versatile tasks.'
  },
  mixtral: {
    label: 'Mixtral 8x7B',
    info: 'Developed by Mistral AI. A mixture-of-experts model combining 8 experts of 7B parameters each for efficient processing.'
  },
  gemma: {
    label: 'Gemma 9B',
    info: 'Developed by Google. A lightweight yet capable model with 9B parameters, optimized for instruction following.'
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
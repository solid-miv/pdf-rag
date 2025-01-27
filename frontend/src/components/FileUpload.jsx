import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10mb limit
const TOTAL_STORAGE_LIMIT = 50 * 1024 * 1024; // 50mb total storage limit

const FileUpload = ({ onFileUpload, currentStorageSize }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // check individual file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(`Files must be under ${MAX_FILE_SIZE / 1024 / 1024}MB each`);
      return;
    }

    // check total size
    const totalSize = files.reduce((acc, file) => acc + file.size, 0) + currentStorageSize;
    if (totalSize > TOTAL_STORAGE_LIMIT) {
      setError(`Total storage limit of ${TOTAL_STORAGE_LIMIT / 1024 / 1024}MB would be exceeded`);
      return;
    }

    setError(null);
    onFileUpload(files);
    e.target.value = '';
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        File size limit: {MAX_FILE_SIZE / 1024 / 1024}MB per file
        <br />
        Total storage limit: {TOTAL_STORAGE_LIMIT / 1024 / 1024}MB
        <br />
        Currently used: {(currentStorageSize / 1024 / 1024).toFixed(2)}MB
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button variant="outlined" component="label" fullWidth>
        Upload Documents
        <input type="file" hidden multiple accept=".pdf,.docx" onChange={handleFileChange} />
      </Button>
    </Box>
  );
};

export default FileUpload;
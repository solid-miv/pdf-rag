import React from 'react';
import { Button, Box } from '@mui/material';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFileUpload(files);
    e.target.value = '';
  };

  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="outlined"
        component="label"
        fullWidth
      >
        Upload Documents
        <input
          type="file"
          hidden
          multiple
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
      </Button>
    </Box>
  );
};

export default FileUpload;
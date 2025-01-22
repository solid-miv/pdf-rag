import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const DocumentList = ({ documents }) => {
  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      {documents.length === 0 ? (
        <Typography color="text.secondary">
          No documents uploaded yet
        </Typography>
      ) : (
        <List>
          {documents.map((doc, index) => (
            <ListItem key={index}>
              <ListItemText primary={doc.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DocumentList;
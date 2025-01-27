import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DocumentList = ({ documents, onDelete }) => {
  return (
    <Paper sx={{ mt: 2, p: 2, maxHeight: '200px', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      {documents.length === 0 ? (
        <Typography color="text.secondary">
          No documents uploaded yet
        </Typography>
      ) : (
        <List dense> {/* Add dense prop for more compact list */}
          {documents.map((doc, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={doc.name} 
                secondary={`${(doc.size / 1024 / 1024).toFixed(2)}MB`}
                primaryTypographyProps={{ variant: 'body2' }} // Smaller text
                secondaryTypographyProps={{ variant: 'caption' }} // Even smaller text for size
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small" onClick={() => onDelete(index)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DocumentList;
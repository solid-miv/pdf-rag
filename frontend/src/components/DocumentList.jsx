import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DocumentList = ({ documents, onDelete }) => {
  return (
    <Paper sx={{ 
      mt: 2, 
      p: 2, 
      maxHeight: '400px',
      overflow: 'auto',
      backgroundColor: 'rgba(26, 35, 126, 0.03)',
      border: '1px solid rgba(26, 35, 126, 0.1)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
        Uploaded Documents
      </Typography>
      {documents.length === 0 ? (
        <Typography color="text.secondary">
          No documents uploaded yet
        </Typography>
      ) : (
        <List dense>
          {documents.map((doc, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={doc.name} 
                secondary={`${(doc.size / 1024 / 1024).toFixed(2)}MB`}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
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
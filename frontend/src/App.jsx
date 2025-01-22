import React, { useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import QueryInput from './components/QueryInput';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import axios from 'axios';

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocuments(prev => [...prev, ...files]);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleQuerySubmit = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/query', { query });
      setResponse(data.answer);
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Q&A System
      </Typography>
      <FileUpload onFileUpload={handleFileUpload} />
      <DocumentList documents={documents} />
      <QueryInput onSubmit={handleQuerySubmit} />
      {response && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Answer:
          </Typography>
          <Typography>
            {loading ? 'Loading...' : response}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default App;
import React, { useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import QueryInput from './components/QueryInput';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import ResponseDisplay from './components/ResponseDisplay';
import axios from 'axios';

const App = () => {
  const [documents, setDocuments] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalStorageSize, setTotalStorageSize] = useState(0);

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
      const newDocs = files.map(file => ({
        name: file.name,
        size: file.size
      }));
      setDocuments(prev => [...prev, ...newDocs]);
      setTotalStorageSize(prev => prev + files.reduce((acc, file) => acc + file.size, 0));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleQuerySubmit = async (query) => {
    setLoading(true);
    setResponse('');
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const text = line.slice(6);
            setResponse(prev => prev + text);
          }
        });
      }
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docIndex) => {
    try {
      await axios.delete(`/api/documents/${documents[docIndex].name}`);
      setTotalStorageSize(prev => prev - documents[docIndex].size);
      setDocuments(prev => prev.filter((_, i) => i !== docIndex));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          RAG Assistant
        </Typography>
        <Grid container spacing={3}>
          {/* Left Column - Document Management */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              <FileUpload 
                onFileUpload={handleFileUpload} 
                currentStorageSize={totalStorageSize}
              />
              <DocumentList 
                documents={documents} 
                onDelete={handleDeleteDocument} 
              />
            </Box>
          </Grid>
          
          {/* Right Column - Q&A Interface */}
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              backgroundColor: 'white', 
              p: 3, 
              borderRadius: 2,
              boxShadow: 1
            }}>
              <QueryInput onSubmit={handleQuerySubmit} />
              <ResponseDisplay response={response} loading={loading} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          backgroundColor: '#1a237e',
          color: 'white',
          mt: 4
        }}
      >
        <Typography variant="body2">
          © 2025 Developed by solid_miv
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
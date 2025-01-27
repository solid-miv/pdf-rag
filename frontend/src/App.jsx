import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Document Q&A System
      </Typography>
      <FileUpload 
        onFileUpload={handleFileUpload} 
        currentStorageSize={totalStorageSize}
      />
      <DocumentList 
        documents={documents} 
        onDelete={handleDeleteDocument} 
      />
      <QueryInput onSubmit={handleQuerySubmit} />
      <ResponseDisplay response={response} loading={loading} />
    </Container>
  );
};

export default App;
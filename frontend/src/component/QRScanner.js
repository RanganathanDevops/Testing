import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import { Typography, Paper, Button } from '@material-ui/core';

const QRScanner = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleScan = (data) => {
    if (data) {
      // Extract AC unit ID from URL
      const match = data.match(/ac\/(\d+)/);
      if (match && match[1]) {
        history.push(`/ac/${match[1]}`);
      } else {
        setError('Invalid QR code - no AC unit ID found');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error scanning QR code');
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Scan AC Unit QR Code
      </Typography>
      
      <div style={{ margin: '20px 0' }}>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>
      
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => history.push('/')}>
          Back to List
        </Button>
      </div>
    </Paper>
  );
};

export default QRScanner;
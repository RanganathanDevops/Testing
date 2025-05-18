import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';

const ACUnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('/api/ac-units');
        setUnits(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching AC units:', error);
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>AC Units</h1>
      <Button variant="contained" color="primary" component={Link} to="/add-ac">
        Add New AC Unit
      </Button>
      <Button variant="contained" color="secondary" component={Link} to="/scan" style={{ marginLeft: '10px' }}>
        Scan QR Code
      </Button>
      
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Installation Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell>{unit.floor_number}</TableCell>
                <TableCell>{unit.room_number}</TableCell>
                <TableCell>{unit.ac_model}</TableCell>
                <TableCell>{unit.installation_date}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/ac/${unit.id}`} size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ACUnitList;
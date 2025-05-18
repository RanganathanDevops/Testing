import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { 
  Paper, Typography, List, ListItem, ListItemText, Button, 
  Card, CardContent, Grid, Divider 
} from '@material-ui/core';
import QRCode from 'qrcode.react';

const ACUnitDetail = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await axios.get(`/api/ac-units/${id}`);
        setUnit(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!unit) return <div>AC unit not found</div>;

  const latestMaintenance = unit.MaintenanceRecords && unit.MaintenanceRecords[0];

  return (
    <div>
      <Button component={Link} to="/" style={{ marginBottom: '20px' }}>
        Back to List
      </Button>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                AC Unit Details
              </Typography>
              <Divider style={{ marginBottom: '15px' }} />
              
              <List>
                <ListItem>
                  <ListItemText primary="Floor" secondary={unit.floor_number} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Room" secondary={unit.room_number} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Model" secondary={unit.ac_model} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Installation Date" secondary={unit.installation_date} />
                </ListItem>
              </List>
              
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to={`/ac/${unit.id}/add-maintenance`}
                style={{ marginTop: '15px' }}
              >
                Add Maintenance Record
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                QR Code
              </Typography>
              <Divider style={{ marginBottom: '15px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {unit.qr_code_url ? (
                  <QRCode value={`https://yourdomain.com/ac/${unit.id}`} size={200} />
                ) : (
                  <Typography>QR Code not generated</Typography>
                )}
              </div>
              
              <Button 
                variant="outlined" 
                color="primary" 
                style={{ marginTop: '15px' }}
                onClick={() => window.print()}
              >
                Print QR Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {latestMaintenance && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Latest Maintenance
                </Typography>
                <Divider style={{ marginBottom: '15px' }} />
                
                <List>
                  <ListItem>
                    <ListItemText primary="Date" secondary={latestMaintenance.maintenance_date} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Type" secondary={latestMaintenance.maintenance_type} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Technician" secondary={latestMaintenance.technician_name || 'N/A'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Next Maintenance" secondary={latestMaintenance.next_maintenance_date || 'Not scheduled'} />
                  </ListItem>
                  {latestMaintenance.notes && (
                    <ListItem>
                      <ListItemText primary="Notes" secondary={latestMaintenance.notes} />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ACUnitDetail;
require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const QRCode = require('qrcode');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/ac_maintenance');

// Define models
const ACUnit = sequelize.define('ACUnit', {
    floor_number: { type: DataTypes.INTEGER, allowNull: false },
    room_number: { type: DataTypes.STRING, allowNull: false },
    ac_model: { type: DataTypes.STRING, allowNull: false },
    installation_date: { type: DataTypes.DATEONLY, allowNull: false },
    qr_code_url: { type: DataTypes.STRING }
}, {
    timestamps: true,
    underscored: true
});

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
    maintenance_date: { type: DataTypes.DATEONLY, allowNull: false },
    maintenance_type: { type: DataTypes.STRING, allowNull: false },
    technician_name: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    next_maintenance_date: { type: DataTypes.DATEONLY }
}, {
    timestamps: true,
    underscored: true
});

ACUnit.hasMany(MaintenanceRecord);
MaintenanceRecord.belongsTo(ACUnit);

// Routes
app.get('/api/ac-units', async (req, res) => {
    try {
        const units = await ACUnit.findAll();
        res.json(units);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ac-units', async (req, res) => {
    try {
        const unit = await ACUnit.create(req.body);
        
        // Generate QR code URL
        const qrCodeUrl = await QRCode.toDataURL(`https://yourdomain.com/ac/${unit.id}`);
        unit.qr_code_url = qrCodeUrl;
        await unit.save();
        
        res.status(201).json(unit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/ac-units/:id', async (req, res) => {
    try {
        const unit = await ACUnit.findByPk(req.params.id, {
            include: [{
                model: MaintenanceRecord,
                order: [['maintenance_date', 'DESC']],
                limit: 1
            }]
        });
        
        if (!unit) {
            return res.status(404).json({ error: 'AC unit not found' });
        }
        
        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ac-units/:id/maintenance', async (req, res) => {
    try {
        const unit = await ACUnit.findByPk(req.params.id);
        if (!unit) {
            return res.status(404).json({ error: 'AC unit not found' });
        }
        
        const record = await MaintenanceRecord.create({
            ...req.body,
            ac_unit_id: unit.id
        });
        
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('frontend/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// }
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request Logger Middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${req.method}] ${req.url} [${timestamp}]`);
    next();
};
app.use(requestLogger);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// --- REST Endpoints connected directly to MongoDB ---

// Get all doctors
app.get('/api/v1/doctors', async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        next(error);
    }
});

// Add a new doctor
app.post('/api/v1/doctors', async (req, res, next) => {
    try {
        const { name, specialisation, email, available } = req.body;
        const doctor = new Doctor({ 
            name, 
            specialisation, 
            email: email || `${name.replace(/\s+/g, '').toLowerCase()}${Date.now()}@doctor.com`,
            available: available !== undefined ? available : true 
        });
        await doctor.save();
        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        next(error);
    }
});

app.get('/api/v1/appointments', async (req, res, next) => {
    try {
        const appointments = await Appointment.find().populate('patientId doctorId');
        
        // Format for the React frontend
        const formatted = appointments.map(app => ({
            id: app._id,
            patientName: app.patientId ? app.patientId.name : 'Unknown Patient',
            doctorName: app.doctorId ? app.doctorId.name : 'Unknown Doctor',
            date: app.date.toISOString().split('T')[0],
            timeSlot: app.timeSlot,
            status: app.status
        }));
        
        res.status(200).json(formatted);
    } catch (error) {
        next(error);
    }
});

app.post('/api/v1/appointments', async (req, res, next) => {
    try {
        const { patientName, doctorId, date, timeSlot } = req.body;

        // Auto-create a patient if they don't exist (simulating login/registration)
        let patient = await Patient.findOne({ name: patientName });
        if (!patient) {
            patient = new Patient({
                name: patientName,
                // Email is required in the schema, so we generate a mock one
                email: `${patientName.replace(/\s+/g, '').toLowerCase()}_${Date.now()}@example.com`
            });
            await patient.save();
        }

        // Create the appointment in MongoDB
        const appointment = new Appointment({
            patientId: patient._id,
            doctorId: doctorId,
            date: date,
            timeSlot: timeSlot,
            status: 'pending'
        });
        await appointment.save();

        // Fetch it back with populated relations to send to frontend
        const populated = await Appointment.findById(appointment._id).populate('patientId doctorId');
        
        res.status(201).json({ 
            message: 'Appointment created successfully', 
            data: {
                id: populated._id,
                patientName: populated.patientId.name,
                doctorName: populated.doctorId.name,
                date: populated.date.toISOString().split('T')[0],
                timeSlot: populated.timeSlot,
                status: populated.status
            } 
        });
    } catch (error) {
        next(error);
    }
});

// --- Task 5: MongoDB Endpoints to demonstrate schema and validation ---

// Create Patient (Demonstrates Mongoose Save & Validation)
app.post('/api/v1/patients', async (req, res, next) => {
    try {
        const patient = new Patient(req.body);
        const savedPatient = await patient.save();
        res.status(201).json({
            success: true,
            data: savedPatient
        });
    } catch (error) {
        next(error); // Passes to global error handler
    }
});

app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

// Global Error-Handling Middleware (Task 3 + Task 5)
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.name || 'Error'}: ${err.message}`);
    
    // Handle Mongoose Validation Error (Task 5 Requirement)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: "Validation Error",
            messages: messages
        });
    }
    
    // Handle Mongoose Duplicate Key Error (e.g., unique email)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: "Duplicate Error",
            message: "A record with that value already exists"
        });
    }

    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: err.message || "Something went wrong on the server"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

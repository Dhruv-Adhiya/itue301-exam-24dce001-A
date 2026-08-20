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

// In-memory arrays for Task 3 (kept for compatibility)
const doctors = [
    { id: 1, name: "Dr. Smith", specialisation: "Cardiology", available: true },
    { id: 2, name: "Dr. Adams", specialisation: "Neurology", available: true }
];
const appointments = [];

// --- Task 3 Endpoints ---
app.get('/api/v1/doctors', (req, res, next) => {
    try {
        res.status(200).json(doctors);
    } catch (error) {
        next(error);
    }
});

app.get('/api/v1/appointments', (req, res, next) => {
    try {
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
});

app.post('/api/v1/appointments', (req, res, next) => {
    try {
        const newAppointment = {
            id: appointments.length + 1,
            ...req.body,
            status: 'pending'
        };
        appointments.push(newAppointment);
        res.status(201).json({ message: 'Appointment created successfully', data: newAppointment });
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

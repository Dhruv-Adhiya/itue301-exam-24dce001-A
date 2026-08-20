const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// Apply the middleware globally
app.use(requestLogger);

// MongoDB connection (Fixed the options error from before)
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// In-memory arrays for Task 3
const doctors = [
    { id: 1, name: "Dr. Smith", specialisation: "Cardiology" },
    { id: 2, name: "Dr. Adams", specialisation: "Neurology" }
];
const appointments = [];

// REST API Endpoints for Task 3

// Return all doctors
app.get('/api/v1/doctors', (req, res, next) => {
    try {
        res.status(200).json(doctors);
    } catch (error) {
        next(error);
    }
});

// Return all appointments
app.get('/api/v1/appointments', (req, res, next) => {
    try {
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
});

// Create a new appointment
app.post('/api/v1/appointments', (req, res, next) => {
    try {
        // Minimal mock creation using in-memory array
        const newAppointment = {
            id: appointments.length + 1,
            ...req.body,
            status: 'pending' // Default status
        };
        appointments.push(newAppointment);
        res.status(201).json({ message: 'Appointment created successfully', data: newAppointment });
    } catch (error) {
        next(error);
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

// Global Error-Handling Middleware (Must be the last middleware)
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: err.message || "Something went wrong on the server"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

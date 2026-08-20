const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Patient name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Patient email is required'],
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: '{VALUE} is not a supported blood group'
        },
        trim: true
    },
    age: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);

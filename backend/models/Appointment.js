const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient ID is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    timeSlot: {
        type: String,
        required: [true, 'Time slot is required']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'cancelled'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    reason: {
        type: String,
        maxLength: [300, 'Reason cannot exceed 300 characters'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

import React from 'react';
import './AppointmentCard.css';

const AppointmentCard = ({ patientName, doctorName, date, timeSlot, status }) => {
  // Determine class based on status for styling
  const statusClass = `status-${status.toLowerCase()}`;

  return (
    <div className="appointment-card">
      <div className="card-header">
        <h3>Appointment Details</h3>
        <span className={`status-badge ${statusClass}`}>{status}</span>
      </div>
      <div className="card-body">
        <p><strong>Patient:</strong> {patientName}</p>
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {timeSlot}</p>
      </div>
    </div>
  );
};

export default AppointmentCard;

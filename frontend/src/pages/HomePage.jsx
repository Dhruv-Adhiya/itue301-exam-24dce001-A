import React from 'react';
import AppointmentCard from '../components/AppointmentCard';

const HomePage = () => {
  // Mock data to demonstrate composition and props
  const recentAppointments = [
    {
      id: 1,
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      date: "2026-08-21",
      timeSlot: "10:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      patientName: "Jane Roe",
      doctorName: "Dr. Adams",
      date: "2026-08-22",
      timeSlot: "02:30 PM",
      status: "pending"
    }
  ];

  return (
    <div className="home-page" style={{ padding: '20px' }}>
      <h1>Welcome to MedCare Plus</h1>
      <p>Your trusted hospital appointment system.</p>
      
      <section>
        <h2>Recent Appointments</h2>
        <div className="appointments-list">
          {recentAppointments.map(app => (
            <AppointmentCard 
              key={app.id}
              patientName={app.patientName}
              doctorName={app.doctorName}
              date={app.date}
              timeSlot={app.timeSlot}
              status={app.status}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

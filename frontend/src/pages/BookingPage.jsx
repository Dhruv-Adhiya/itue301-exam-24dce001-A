import React from 'react';
import AppointmentCard from '../components/AppointmentCard';

const BookingPage = () => {
  // A cancelled appointment to demonstrate the cancelled status
  const cancelledAppointment = {
    id: 3,
    patientName: "Alice Walker",
    doctorName: "Dr. Brown",
    date: "2026-08-25",
    timeSlot: "11:00 AM",
    status: "cancelled"
  };

  return (
    <div className="booking-page" style={{ padding: '20px' }}>
      <h1>Book an Appointment</h1>
      <p>Fill out the form below to book an appointment with our doctors.</p>
      
      {/* Mock booking form placeholder */}
      <form style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <p><em>(Booking Form Fields Go Here)</em></p>
        <button type="button" disabled>Submit Booking</button>
      </form>

      <section>
        <h2>Past/Cancelled Bookings</h2>
        <AppointmentCard {...cancelledAppointment} />
      </section>
    </div>
  );
};

export default BookingPage;

import React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    timeSlot: ''
  });
  
  const [selectedDoctor, setSelectedDoctor] = useState('');
  
  // New States for API integration
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch doctors and appointments when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, appointmentsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/doctors'),
          fetch('http://localhost:5000/api/v1/appointments')
        ]);
        
        if (doctorsRes.ok) {
          const docs = await doctorsRes.json();
          setDoctors(docs);
        }
        if (appointmentsRes.ok) {
          const apps = await appointmentsRes.json();
          setAppointments(apps);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Find the doctor name for the payload (since selectedDoctor is the ID)
      const doc = doctors.find(d => String(d.id || d._id) === String(selectedDoctor));
      const doctorName = doc ? doc.name : selectedDoctor;

      const response = await fetch('http://localhost:5000/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: formData.patientName,
          doctorId: selectedDoctor, // Send the _id of the doctor for MongoDB relation
          date: formData.date,
          timeSlot: formData.timeSlot
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Add the newly created appointment to the list dynamically
        setAppointments(prev => [...prev, result.data]);
        setMessage('Appointment successfully booked!');
        
        // Reset the form
        setFormData({ patientName: '', date: '', timeSlot: '' });
        setSelectedDoctor('');
      } else {
        setMessage('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setMessage('Error connecting to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h1>Book an Appointment</h1>
      <p style={{ marginBottom: '30px' }}>Fill out the form below to book an appointment with our doctors.</p>

      {message && (
        <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da', color: message.includes('success') ? '#155724' : '#721c24', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
          {message}
        </div>
      )}

      {/* Dynamic Display of State */}
      {(formData.patientName || selectedDoctor) && (
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', color: '#000', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #1976d2', width: '100%', maxWidth: '500px', textAlign: 'left' }}>
          <strong>Booking Summary Preview:</strong> 
          {formData.patientName && <span style={{ marginLeft: '10px' }}>Patient: <em>{formData.patientName}</em></span>}
          {selectedDoctor && <span style={{ marginLeft: '10px' }}>| Doctor: <em>{doctors.find(d => String(d.id || d._id) === String(selectedDoctor))?.name || 'Selected'}</em></span>}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ margin: '0 auto 50px auto', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '500px', backgroundColor: '#fff', color: '#000', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'left' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Patient Name:</label>
          <input 
            type="text" 
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            required
            placeholder="Enter patient name"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Doctor Name:</label>
          <select 
            value={selectedDoctor} 
            onChange={handleDoctorChange}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor.id || doctor._id} value={doctor.id || doctor._id}>
                {doctor.name} ({doctor.specialisation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date:</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Time Slot:</label>
          <select 
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            required
          >
            <option value="">-- Select Time Slot --</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="02:00 PM">02:00 PM</option>
          </select>
        </div>

        <button type="submit" disabled={submitting} style={{ padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '1rem' }}>
          {submitting ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>

      {/* Render the submitted appointments from the backend */}
      <section style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '20px' }}>Your Booked Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            {appointments.map(app => (
              <AppointmentCard 
                key={app.id || app._id}
                patientName={app.patientName}
                doctorName={app.doctorName}
                date={app.date}
                timeSlot={app.timeSlot}
                status={app.status}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingPage;

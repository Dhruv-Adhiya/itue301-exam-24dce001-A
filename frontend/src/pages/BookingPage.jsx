import React, { useState } from 'react';

const BookingPage = () => {
  // State 1: Manage form data (patient name, date, time slot)
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    timeSlot: ''
  });
  
  // State 2: Manage selected doctor separately to satisfy the "two state values" requirement
  const [selectedDoctor, setSelectedDoctor] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking submitted!');
  };

  return (
    <div className="booking-page" style={{ padding: '20px' }}>
      <h1>Book an Appointment</h1>
      <p>Fill out the form below to book an appointment with our doctors.</p>

      {/* Dynamic Display of State */}
      {(formData.patientName || selectedDoctor) && (
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px', marginBottom: '20px', borderLeft: '4px solid #1976d2' }}>
          <strong>Booking Summary Preview:</strong> 
          {formData.patientName && <span style={{ marginLeft: '10px' }}>Patient: <em>{formData.patientName}</em></span>}
          {selectedDoctor && <span style={{ marginLeft: '10px' }}>| Doctor: <em>{selectedDoctor}</em></span>}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', backgroundColor: '#fff' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Patient Name:</label>
          <input 
            type="text" 
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
            placeholder="Enter patient name"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Doctor Name:</label>
          <select 
            value={selectedDoctor} 
            onChange={handleDoctorChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          >
            <option value="">-- Select a Doctor --</option>
            <option value="Dr. Smith">Dr. Smith (Cardiology)</option>
            <option value="Dr. Adams">Dr. Adams (Neurology)</option>
            <option value="Dr. Brown">Dr. Brown (Pediatrics)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time Slot:</label>
          <select 
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          >
            <option value="">-- Select Time Slot --</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="02:00 PM">02:00 PM</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;

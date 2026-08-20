import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for adding a new doctor
  const [newDoctor, setNewDoctor] = useState({ name: '', specialisation: '' });
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctor data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/v1/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDoctor.name,
          specialisation: newDoctor.specialisation,
          available: true
        })
      });

      if (response.ok) {
        setAddMessage('Doctor added successfully!');
        setNewDoctor({ name: '', specialisation: '' });
        fetchDoctors(); // Refresh the list
      } else {
        const errData = await response.json();
        setAddMessage(errData.message || 'Failed to add doctor');
      }
    } catch (err) {
      setAddMessage('Error connecting to server');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="doctors-page" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Our Doctors</h1>
      <p style={{ marginBottom: '30px' }}>Here you can view a list of all our available doctors and add new ones.</p>

      {/* Add Doctor Form */}
      <div style={{ margin: '0 auto 40px auto', padding: '30px', borderRadius: '12px', backgroundColor: '#fff', color: '#000', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'left' }}>
        <h3 style={{ marginTop: '0', textAlign: 'center' }}>Add New Doctor</h3>
        {addMessage && <p style={{ color: addMessage.includes('success') ? 'green' : 'red', textAlign: 'center' }}>{addMessage}</p>}
        <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Name:</label>
            <input 
              type="text" 
              value={newDoctor.name} 
              onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Specialisation:</label>
            <input 
              type="text" 
              value={newDoctor.specialisation} 
              onChange={(e) => setNewDoctor({...newDoctor, specialisation: e.target.value})} 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" disabled={adding} style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            {adding ? 'Adding...' : 'Add Doctor'}
          </button>
        </form>
      </div>
      
      {loading && <div style={{ padding: '20px', color: '#007bff' }}><strong>Loading doctors...</strong></div>}
      {error && <div style={{ padding: '20px', color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}><strong>Error:</strong> {error}</div>}
      
      {!loading && !error && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {data.map(doctor => (
            <div key={doctor.id || doctor._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{doctor.name}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>Specialisation:</strong> {doctor.specialisation}</p>
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>Availability:</strong> 
                <span style={{ color: (doctor.available !== false) ? 'green' : 'red', marginLeft: '5px', fontWeight: 'bold' }}>
                  {(doctor.available !== false) ? 'Available' : 'Not Available'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <p>No doctors found. Please add a doctor above.</p>
      )}
    </div>
  );
};

export default DoctorsPage;

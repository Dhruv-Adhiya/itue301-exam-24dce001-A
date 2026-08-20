import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Assuming backend runs on port 5000 (from previous tasks)
        const response = await fetch('http://localhost:5000/api/v1/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctors-page" style={{ padding: '20px' }}>
      <h1>Our Doctors</h1>
      <p>Here you can view a list of all our available doctors and their specializations.</p>
      
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
        <p>No doctors found.</p>
      )}
    </div>
  );
};

export default DoctorsPage;

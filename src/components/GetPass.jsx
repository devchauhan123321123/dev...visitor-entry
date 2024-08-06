import React, { useState, useEffect } from 'react';
import './Getpass.css';
import { getApartments, addApartment, getApartmentByMobile, updateApartment } from './db';

const App = () => {
  const [apartments, setApartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    blockNumber: '',
    floorNumber: '',
    timestamp: ''
  });
  const [isVisitor, setIsVisitor] = useState(false);
  const [visitorMobile, setVisitorMobile] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      const apartmentsData = await getApartments();
      setApartments(apartmentsData);
    };

    fetchApartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMobileChange = async (e) => {
    const { value } = e.target;
    setFormData({ ...formData, mobileNumber: value });

    if (value.length === 12) {
      const existingApartment = await getApartmentByMobile(value);
      if (existingApartment) {
        setFormData({
          ...formData,
          name: existingApartment.name,
          mobileNumber: value,
          blockNumber: '',
          floorNumber: '',
          timestamp: ''
        });
        setIsVisitor(true);
        setVisitorMobile(existingApartment.mobileNumber);
      } else {
        setFormData({
          ...formData,
          name: '',
          blockNumber: '',
          floorNumber: '',
          timestamp: ''
        });
        setIsVisitor(false);
        setVisitorMobile('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    const newFormData = { ...formData, timestamp };
    await addApartment(newFormData);
    setApartments([...apartments, newFormData]);

    setFormData({ name: '', mobileNumber: '', blockNumber: '', floorNumber: '', timestamp: '' });
    setIsVisitor(false);
    setVisitorMobile('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const existingApartment = await getApartmentByMobile(formData.mobileNumber);
    if (existingApartment) {
      setFormData({
        name: existingApartment.name,
        mobileNumber: existingApartment.mobileNumber
      });
      setIsVisitor(true);
      setVisitorMobile(existingApartment.mobileNumber);
    } else {
      alert('No visitor found with this mobile number');
    }
  };

  const handleEdit = (id, mobileNumber) => {
    const apartmentToEdit = apartments.find(apartment => apartment.id === id);
    setFormData({
      name: apartmentToEdit.name,
      mobileNumber: apartmentToEdit.mobileNumber,
      blockNumber: apartmentToEdit.blockNumber,
      floorNumber: apartmentToEdit.floorNumber,
      timestamp: apartmentToEdit.timestamp
    });
    setIsEditing(true);
    setEditId(id);
  };

  return (
    <div className="app-container">
      <h1>Visitor Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input type="number" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleMobileChange} required />
          <button type="button" onClick={handleSearch}>Search</button>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required readOnly={isVisitor} />
        </div>
        <div className="form-group">
          <label htmlFor="blockNumber">Block Number:</label>
          <input type="text" id="blockNumber" name="blockNumber" value={formData.blockNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="floorNumber">Floor Number:</label>
          <input type="number" id="floorNumber" name="floorNumber" value={formData.floorNumber} onChange={handleChange} required />
        </div>
        <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
      </form>

      <h2>Visitor List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Block Number</th>
            <th>Floor Number</th>
            <th>Entered At</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apartment, index) => (
            <tr key={index} className={apartment.mobileNumber === visitorMobile ? 'visitor' : ''}>
              <td>{apartment.name}</td>
              <td>{apartment.mobileNumber}</td>
              <td>{apartment.blockNumber}</td>
              <td>{apartment.floorNumber}</td>
              <td>{new Date(apartment.timestamp).toLocaleString()}</td>
              <td><button onClick={() => handleEdit(apartment.id, apartment.mobileNumber)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

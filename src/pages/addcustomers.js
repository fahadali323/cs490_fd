import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import '../styling/film_details.css';


function AddCustomer() {
  const [newCustomerData, setNewCustomerData] = useState({
    store_id: '',
    first_name: '',
    last_name: '',
    email: '',
    address_id: '',
    active: 1, // Assuming active by default
  });

  const handleAddCustomer = async () => {
    try {
      const response = await fetch('http://localhost:5001/customers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomerData),
      });

      if (response.ok) {
        toast.success('Customer added successfully');
        // You can navigate back to the customer search page or perform other actions here
      } else {
        const data = await response.json();
        toast.error(data.error || 'An error occurred while adding the customer');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while adding the customer');
    }
  };

  return (
    <div className="film-details-container"> {/* Apply styles to the container */}
      <ToastContainer />
      <h1>Add Customer</h1>
      <Link to="/customers" className="return-link">Return to Customers Search</Link> 
      <div>
        <label>Store ID:</label>
        <input
          type="text"
          value={newCustomerData.store_id}
          onChange={(e) => setNewCustomerData({ ...newCustomerData, store_id: e.target.value })}
        />
      </div>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={newCustomerData.first_name}
          onChange={(e) => setNewCustomerData({ ...newCustomerData, first_name: e.target.value })}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={newCustomerData.last_name}
          onChange={(e) => setNewCustomerData({ ...newCustomerData, last_name: e.target.value })}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={newCustomerData.email}
          onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
        />
      </div>
      <div>
        <label>Address ID:</label>
        <input
          type="text"
          value={newCustomerData.address_id}
          onChange={(e) => setNewCustomerData({ ...newCustomerData, address_id: e.target.value })}
        />
      </div>
      <div>
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>
    </div>
  );
}

export default AddCustomer;


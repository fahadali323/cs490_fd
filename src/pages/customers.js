import React, { useState, useEffect } from 'react';
import '../styling/moviessearch.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('customer_id'); // Default search type is customer_id
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10); // Number of results to display per page
  const [availableResultsPerPage] = useState([10, 20, 30]); // Available options for results per page
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showMovies, setShowMovies] = useState(null);


  // eslint-disable-next-line 
  const fetchCustomers = async () => {
    try {
      // Remove the query parameters from the URL to retrieve all customers
      const response = await fetch('http://localhost:5001/customers/search');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setError('');
        setTotalPages(Math.ceil(data.length / resultsPerPage));
      } else {
        setError('An error occurred while fetching data');
        setCustomers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching data');
      setCustomers([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const parseCreateDate = (createDate) => {
    const date = new Date(createDate);
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    return { datePart, timePart };
  };

  const editCustomerDetails = (customerId) => {
    // Find the customer to edit based on the customerId
    const customerToEdit = customers.find((customer) => customer.customer_id === customerId);

    setIsEditing(true);
    setEditingCustomer(customerToEdit);
  };


  const handleEditCustomer = async () => {
    try {
      const response = await fetch('http://localhost:5001/customers/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCustomer),
      });

      if (response.ok) {
        // Customer updated successfully, refresh the customer list
        toast.success('Customer added successfully');
        // fetchCustomers();
        setIsEditing(false); // Close the edit form
      } else {
        // Handle error here
        console.error('Error updating customer');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5001/customers/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: customerId }),
      });

      if (response.ok) {
        // Customer deleted successfully, refresh the customer list
        toast.success('Customer deleted successfully');
        fetchCustomers(); // Refresh the customer list
      } else {
        // Handle error here
        console.error('Error deleting customer');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRentedMovies = async (customerId) => {
    try {
      // Fetch rented movies for the specified customer ID
      const rentedMovies = await fetch(`/customers/${customerId}`);
      if (!rentedMovies.ok) {
        throw new Error('Failed to fetch rented movies');
      }
      const rentedMoviesData = await rentedMovies.json();
      setMovies(rentedMoviesData);
      setShowMovies(true);
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., set an error message or log it
    }
  };
  const clearRentedMovies = () => {
    setMovies([]);
    setShowMovies(false);
  };


  const handleSearch = async () => {
    try {
      let url = '/customers/search?';
      // Construct the URL with the correct query parameters based on searchType
      if (searchType === 'customer_id') {
        url += `customerId=${searchTerm}`;
      } else if (searchType === 'first_name') {
        url += `firstName=${searchTerm}`;
      } else if (searchType === 'last_name') {
        url += `lastName=${searchTerm}`;
      }
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setError('');
        setCurrentPage(1);
        setTotalPages(Math.ceil(data.length / resultsPerPage));
      } else {
        setError('An error occurred while fetching data');
        setCustomers([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching data');
      setCustomers([]);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  const clearResults = () => {
    setCustomers([]);
    setTotalPages(1);
    setSearchTerm('');
    setSearchType('customer_id'); // Reset the search type to customer_id
  };

  const indexOfLastCustomer = currentPage * resultsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - resultsPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <ToastContainer />
      <h1>Customer Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="customer_id">Customer ID</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearResults}>Clear</button>
      </div>
      <div>
        {error && <p>{error}</p>}
        <h2>Search Results</h2>
        <Link to="/add-customer">Add Customer</Link>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => {
              const { datePart, timePart } = parseCreateDate(customer.create_date);
              return (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{datePart}</td> {/* Display the date part */}
                  <td>{timePart}</td> {/* Display the time part */}
                  <td>
                    <button onClick={() => fetchRentedMovies(customer.customer_id)}>View</button>
                    <button onClick={() => editCustomerDetails(customer.customer_id)}>Edit</button>
                    <button onClick={() => deleteCustomer(customer.customer_id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length > resultsPerPage && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(1)} // Go to the first page
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)} // Go to the last page
              disabled={currentPage === totalPages}
            >
              Last
            </button>
            <label>
              Results per Page:
              <select
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(parseInt(e.target.value, 10))}
              >
                {availableResultsPerPage.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

      </div>
      {isEditing && editingCustomer && (
        <div>
          <h2>Edit Customer</h2>
          <form onSubmit={handleEditCustomer}>
            {/* Display customer details */}
            <div>
              <label>Customer ID: {editingCustomer.customer_id}</label>
            </div>
            <div>
              <label>Store ID:</label>
              <input
                type="text"
                value={editingCustomer.store_id}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, store_id: e.target.value })}
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={editingCustomer.first_name}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, first_name: e.target.value })}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={editingCustomer.last_name}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, last_name: e.target.value })}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="text"
                value={editingCustomer.email}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
              />
            </div>
            {/* ... Add input fields for other customer details ... */}
            <div>
              <button type="submit">Update</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

{showMovies && (
  <div>
    <h2>Rented Movies</h2>
    <p>
      <strong>Customer Name:</strong> {movies[0].first_name} {movies[0].last_name}
    </p>
    <table>
      <thead>
        <tr>
          <th>Movie Title</th>
          <th>Rental Date</th>
          <th>Return Date</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie, index) => (
          <tr key={index}>
            <td>{movie.movie_title}</td>
            <td>{new Date(movie.rental_date).toLocaleString()}</td>
            <td>{new Date(movie.return_date).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={clearRentedMovies}>Clear Rented Movies</button>
  </div>
)}



    </div>
  );
}

export default Customers;

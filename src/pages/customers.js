import React, { useState, useEffect } from 'react';
import '../styling/moviessearch.css';
import { Link } from 'react-router-dom';

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('customer');
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10); // Number of results to display per page
  const [availableResultsPerPage] = useState([10, 20, 30]); // Available options for results per page
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5001/customers');
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/customers/search?type=${searchType}&search=${searchTerm}`);
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
    setSearchTerm(''); // Optionally, you can also reset the search term here
    setSearchType('customer'); // Optionally, you can also reset the search type here
  };

  const indexOfLastCustomer = currentPage * resultsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - resultsPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1>Customer Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="customer">Customer Name</option>
          <option value="email">Email</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={clearResults}>Clear</button>
      </div>
      <div>
        {error && <p>{error}</p>}
        <h2>Search Results</h2>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.first_name}</td>
                <td>{customer.last_name}</td>
                <td>{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length > resultsPerPage && (
          <div className="pagination">
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
    </div>
  );
}

export default Customers;

import React, { useState, useEffect } from 'react';
import '../styling/moviessearch.css';
import { Link } from 'react-router-dom';

function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('film');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10); // Number of results to display per page
  const [availableResultsPerPage] = useState([10, 20, 30]); // Available options for results per page

  const [filmToRent, setFilmToRent] = useState(null); // Track the film to rent
  const [customerIDToRent, setCustomerIDToRent] = useState('');
  const [staffIDToRent, setStaffIDToRent] = useState('');
  const [rentalError, setRentalError] = useState('');

  const handleRentMovie = async () => {
    try {
      // Check if all required data is available
      if (!filmToRent || !customerIDToRent || !staffIDToRent) {
        setRentalError('Please provide film, customer, and staff IDs to rent a movie.');
        return;
      }

      // Send a POST request to the rental endpoint
      const response = await fetch('http://localhost:5001/movies/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerIDToRent,
          staff_id: staffIDToRent,
          film_id: filmToRent.film_id,
        }),
      });

      if (response.ok) {
        setRentalError('Movie rented successfully.');
      } else {
        setRentalError('An error occurred while renting the movie.');
      }
    } catch (error) {
      console.error(error);
      setRentalError('An error occurred while renting the movie.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/movies/search?type=${searchType}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setError(''); // Clear any previous errors
        setCurrentPage(1); // Reset to the first page after a new search
      } else {
        setError('An error occurred while fetching data');
        setResults([]); // Clear previous results in case of an error
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching data');
      setResults([]); // Clear previous results in case of an error
    }
  };

  // Function to clear results
  const clearResults = () => {
    setResults([]);
  };

  useEffect(() => {
    // Scroll to the top of the results when changing pages or results per page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, resultsPerPage]);

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div>
      <h1>Movie Search</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="film">Film Name</option>
          <option value="actor">Actor Name</option>
          <option value="genre">Genre</option>
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
              <th>Title</th>
              <th>Description</th>
              <th>Genre</th>
              <th>Actors</th>
            </tr>
          </thead>
          <tbody>
            {results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage).map((result) => (
              <tr key={result.film_id}>
                <td>
                  <Link to={`/movies/${result.film_id}`}>{result.title}</Link>
                </td>
                <td>{result.description}</td>
                <td>{result.genres}</td>
                <td>{result.actors}</td>
                <td>
                  {/* Button to rent a movie */}
                  <button onClick={() => setFilmToRent(result)}>Rent Movie</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length > resultsPerPage && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)} // Go to the first page
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)} // Go to the last page
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
      {filmToRent && (
        <div>
          <h2>Rent Movie</h2>
          <form>
            <div>
              <label>Customer ID:</label>
              <input
                type="text"
                value={customerIDToRent}
                onChange={(e) => setCustomerIDToRent(e.target.value)}
              />
            </div>
            <div>
              <label>Staff ID:</label>
              <input
                type="text"
                value={staffIDToRent}
                onChange={(e) => setStaffIDToRent(e.target.value)}
              />
            </div>
            <button onClick={handleRentMovie}>Rent Movie</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;

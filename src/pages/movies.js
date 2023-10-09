import React, { useState } from 'react';

function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('film');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/movies/search?type=${searchType}&search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setError(''); // Clear any previous errors
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
        <button onClick={clearResults}>Clear</button> {/* Add the "Clear" button */}
      </div>
      <div>
        {error && <p>{error}</p>}
        <h2>Search Results</h2>
        <ul>
          {results.map((result) => (
            <li key={result.film_id}>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <p><strong>Genre:</strong> {result.genres}</p>
              <p><strong>Actors:</strong> {result.actors}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieSearch;

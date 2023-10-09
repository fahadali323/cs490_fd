import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styling/film_details.css'; // Import your CSS file

function FilmDetails() {
  const { film_id } = useParams();
  const [filmData, setFilmData] = useState(null);

  const fetchFilmData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/movies/${film_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFilmData(data[0]);
    } catch (error) {
      console.error('Error fetching film data:', error);
    }
  };  

  useEffect(() => {
    if (film_id) {
      fetchFilmData();
    }
  }, [film_id]);

  return (
    <div className="film-details-container"> {/* Apply styles to the container */}
      <h2>Film Details</h2>
      <Link to="/movies" className="return-link">Return to Movie Search</Link> {/* Apply styles to the Return link */}
      {filmData ? (
        <div className="film-info"> {/* Apply styles to the Film Information */}
          <h3>Film Information:</h3>
          <p>Title: {filmData.title}</p>
          <p>Description: {filmData.description}</p>
          <p>Release Year: {filmData.release_year}</p>
          <p>Rating: {filmData.rating}</p>
          <p>Length: {filmData.length} minutes</p>
          <p>Special Features: {filmData.special_features}</p>
          <p>Rental Count: {filmData.rental_count}</p>
          <p>Categories: {filmData.categories}</p>
          <p>Actors: {filmData.actors}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default FilmDetails;

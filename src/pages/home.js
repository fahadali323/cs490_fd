import React, { useState, useEffect } from 'react';
// import './App.css'; // Import the CSS file
import '../styling/home.css';

function Home() {
  const [filmData, setFilmData] = useState([]);
  const [actorData, setActorData] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);

  useEffect(() => {
    // Make an HTTP GET request to fetch the movie data
    fetch('http://localhost:5001/top_movies')
      .then((response) => response.json())
      .then((data) => setFilmData(data))
      .catch((error) => console.error('Error fetching movie data:', error));

    // Make an HTTP GET request to fetch the actor data
    fetch('http://localhost:5001/top_actors')
      .then((response) => response.json())
      .then((data) => setActorData(data))
      .catch((error) => console.error('Error fetching actor data:', error));
  }, []);

  useEffect(() => {
    // Make an API request to fetch the movie data
    fetch('http://localhost:5001/movies_description')
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleMovieSelect = (event) => {
    const selectedTitle = event.target.value;
    const selectedMovie = movies.find((movie) => movie.title === selectedTitle);
    setSelectedMovie(selectedMovie);
  };

  const handleActorSelect = (event) => {
    const selectedName = event.target.value;
    const selectedActor = actorData.find(
      (actor) => `${actor.first_name} ${actor.last_name}` === selectedName
    );
    setSelectedActor(selectedActor);

    // Fetch actor's top 5 rented movies based on their ID or identifier
    if (selectedActor) {
      fetch(`http://localhost:5001/actor_details/${selectedActor.actor_id}`)
        .then((response) => response.json())
        .then((data) => setActorMovies(data))
        .catch((error) => console.error('Error fetching actor movies:', error));
    }
  };

  const handleClearMovieSelection = () => {
    setSelectedMovie(null);
  };

  const handleClearActorSelection = () => {
    setSelectedActor(null);
    setActorMovies([]); // Clear actor movies when an actor is deselected
  };

  return (
    <div>
      <h2 className="header">Top 5 rented movies</h2>
      <ol className="movie-list">
        {filmData.map((item, index) => (
          <li key={index} className="movie-item">
            {item.title} - {item.rental_count} rentals
          </li>
        ))}
      </ol>

      <h1 className="header">Top 5 Movies</h1>
      <form>
        <label htmlFor="movie-select">Select a Movie: </label>
        <select name="movie-select" id="movie-select" onChange={handleMovieSelect}>
          <option value="">Select a movie</option>
          {movies.map((movie) => (
            <option key={movie.title} value={movie.title}>
              {movie.title}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleClearMovieSelection} className="clear-button">Clear</button>
      </form>
      {selectedMovie && (
        <div>
          <h2>{selectedMovie.title}</h2>
          <p className="description">Description: {selectedMovie.description}</p>
          <p className="release-year">Release Year: {selectedMovie.release_year}</p>
          <p className="rating">Rating: {selectedMovie.rating}</p>
          <p className="special-features">Special Features: {selectedMovie.special_features}</p>
          <p className="rental-count">Rental Count: {selectedMovie.rental_count}</p>
        </div>
      )}

      <div className="actors-list">
        <h2 className="header">Top 5 actors by % of films</h2>
        <ol>
          {actorData.map((item, index) => (
            <li key={index} className="actor-item">
              {item.first_name} {item.last_name} - {item.film_count} films
            </li>
          ))}
        </ol>
      </div>

      <h1 className="header">Top 5 Actors</h1>
      <form>
        <label htmlFor="actor-select">Select an Actor: </label>
        <select name="actor-select" id="actor-select" onChange={handleActorSelect}>
          <option value="">Select an actor</option>
          {actorData.map((actor) => (
            <option key={actor.actor_id} value={`${actor.first_name} ${actor.last_name}`}>
              {`${actor.first_name} ${actor.last_name}`}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleClearActorSelection} className="clear-button">Clear</button>
      </form>
      {selectedActor && (
        <div className="actor-details">
          <h2>{`${selectedActor.first_name} ${selectedActor.last_name}`}</h2>
          {/* Include actor details here */}
        </div>
      )}

      {selectedActor && (
        <div className="actor-movies">
          <h2>Top 5 Rented Movies by {`${selectedActor.first_name} ${selectedActor.last_name}`}</h2>
          <ol>
            {actorMovies.map((movie, index) => (
              <li key={index} className="movie-item">
                {movie.title} - {movie.rental_count} rentals
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default Home
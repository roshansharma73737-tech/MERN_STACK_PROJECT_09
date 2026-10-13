import { Link } from "react-router-dom";

function Moviecard({ movie }) {
  return (
    <article className="movie-card">
      <img src={movie.image} alt={movie.title} className="card-image" />
      <div className="card-content">
        <div className="card-top">
          <span className="badge">{movie.language}</span>
          <span className="rating"> •⭐{movie.rating}</span>
        </div>
        <h3>{movie.title}</h3>
        <p>{movie.genre} • {movie.duration}</p>
        <Link to="/bookings" className="card-btn">Book Ticket</Link>
      </div>
    </article>
  );
}

export default Moviecard;

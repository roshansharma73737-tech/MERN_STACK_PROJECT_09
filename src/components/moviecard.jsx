import { Link } from "react-router-dom";
import { fallbackImage } from "../data/catalog";

function Moviecard({ movie }) {
  return (
    <article className="movie-card">
      <img
        src={movie.image}
        alt={`${movie.title} poster`}
        className="card-image"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className="card-content">
        <div className="card-top">
          <span className="badge">{movie.language}</span>
          <span className="rating"> •⭐{movie.rating}</span>
        </div>
        <h3>{movie.title}</h3>
        <p>{movie.genre} • {movie.duration}</p>
        <Link
          to="/seats"
          state={{
            itemType: "movie",
            itemTitle: movie.title,
            unitPrice: 250
          }}
          className="card-btn"
        >
          Book Ticket
        </Link>
      </div>
    </article>
  );
}

export default Moviecard;

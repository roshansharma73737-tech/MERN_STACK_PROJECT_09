
import MovieCard from "../components/moviecard";

const movies = [
  {
    title: "Skyline Mission",
    language: "Hindi",
    rating: "4.7",
    genre: "Action",
    duration: "2h 18m",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "The Last Journey",
    language: "English",
    rating: "4.5",
    genre: "Drama",
    duration: "2h 05m",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Neon Nights",
    language: "Hindi",
    rating: "4.6",
    genre: "Thriller",
    duration: "2h 12m",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Ocean Dreams",
    language: "English",
    rating: "4.4",
    genre: "Adventure",
    duration: "1h 58m",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "The Avengers",
    language: "English, Hindi",
    rating: "4.6",
    genre: "Action",
    duration: "2h 45m",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80",
  },
];

function Movies() {
  return (
    <main className="movies-container">
      <div className="page-header">
        <span className="section-label">Explore</span>
        <h2>Movies</h2>
        <p>Find something great to watch tonight.</p>
      </div>

      <div className="filter-bar">
        <button className="filter active">All</button>
        <button className="filter">Hindi</button>
        <button className="filter">Action</button>
        <button className="filter">Drama</button>
      </div>

      <div className="card grid">
        {movies.map((movie) => (
          <MovieCard key={movie.title} movie={movie} />
        ))}
      </div>
    </main>
  );
}

export default Movies;
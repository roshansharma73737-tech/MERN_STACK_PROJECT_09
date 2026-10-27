
import { useMemo, useState } from "react";
import MovieCard from "../components/moviecard";
import { movies } from "../data/catalog";

function Movies() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = useMemo(
    () => ["All", ...new Set(movies.map((movie) => movie.genre))],
    []
  );
  const visibleMovies = activeFilter === "All"
    ? movies
    : movies.filter((movie) => movie.genre === activeFilter);

  return (
    <main className="movies-container">
      <div className="page-header">
        <span className="section-label">Explore</span>
        <h2>Movies</h2>
        <p>Find something great to watch tonight.</p>
      </div>

      <div className="filter-bar">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filter ${activeFilter === filter ? "active" : ""}`}
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="card grid">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.title} movie={movie} />
        ))}
      </div>
    </main>
  );
}

export default Movies;
import { Link } from "react-router-dom";
import Moviecard from "../components/moviecard";
import Eventcard from "../components/eventcard";
import { events, movies } from "../data/catalog";

function Home(){
    return (
      <>
        <section className="hero">
            <div className="hero-overlay">
                <div className="hero-content">
                    <span className="eyebrow">YOUR TICKET. YOUR EXPERIENCE.</span>
                    <h1>Book moments<br /><span>worth remembering.</span></h1>
                    <p>Discover movies, concerts, comedy shows and exciting events near you.</p>
                    <div className="hero-actions">
                        <Link to="/movies" className="primary-btn">Explore Movies</Link>
                        <Link to="/events" className="secondary-btn">View Events</Link>
                    </div>
                </div>
            </div>
      </section>

      <section className="quick-search">
            <div className="search-item">
                <span>📍</span>
                <div><small>Location</small><strong>Ahmedabad</strong></div>
            </div>
            <div className="search-item">
                <span>🎬</span>
                <div><small>Looking for</small><strong>Movies & Events</strong></div>
            </div>
            <Link to="/movies" className="search-btn">Search Tickets</Link>
        </section>
        <main className =" contant">
            <section className ="under_contant">
                <div className = "very_under_contant">
                    <div><span className="span-label">Now showing</span><h2>Popular movies</h2></div>
                    <Link to="/movies" className="view">View all</Link>
                </div>
                <div className="contants">
                    {movies.slice(0, 4).map((movie) => <Moviecard key={movie.title} movie={movie} />)}
                </div> 
            </section>

            
            <section className="under_contant">
                <div className="very_under_contant">
                    <div><span className="span-label">On the calendar</span><h2>Upcoming events</h2></div>
                    <Link to="/events" className="view"> View ALL </Link>
                </div>
                <div className="contants">
                    {events.slice(0, 4).map((event) => <Eventcard key={event.title} event={event} />)}
                </div>
            </section>
        </main>
      </>
      
    );
}

export default Home;
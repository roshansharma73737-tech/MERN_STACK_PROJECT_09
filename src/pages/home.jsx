import { Link } from "react-router-dom";
import Moviecard from "../components/moviecard";
import Eventcard from "../components/eventcard";


const movies = [
    {
        title : "Skyline Mission ",
        language : "english",
        rating: "4.3",
        genre: "Action",
        duration : "2h 30m",
        image : "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80"
    },
    {
        title : "The Avengers",
        language :"hindi , english",
        rating:"4.5",
        genre: "Action ",
        duration : "2h 30m",
        image : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80"
    },
    {
        title : " The Titanic",
        language : "hindi , English",
        rating :"4.7",
        genre :"Romance ",
        duration : " 2h 30m",
        image : "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80"
    }
];


const event = [
    {
        title : "Stand up comedy",
        duration : "4h 30m ",
        cetegory : " Gold  ,  Sliver , Bronze , Platinum",
        date : "25 dec",
        venue : "Riverfront  Arena",
        image : "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=800&q=80",
        actor : "----",
        Price : "On standing",
    },
    {
        title : "  Garbha Arena",
        duration : "6pm  to 2am , on night ",
        cetegory : "VIP , Genral ",
        pass_price  : " genral = 200  , vip = 500",
        date  : "22 oct",
        venue : "sindhu bhavan , S.G highway",
        image : "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"
    },
    {
        title :"Music consert",
        duration : " 9pm to 12am",
        cetegory : " Gold  ,  Sliver , Bronze , Platinum",
        date : "30 dec",
        venue : "Gift city  Ghandhinagar",
        image : "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        actor : "----",
        Price : "On standing",
    },
];

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
                    <div><span className = "span-label"> The label  </span> <h2> Ppopular movies</h2></div>
                    <Link to ="/movies" className=" view "> View ALL-- </Link>
                </div>
                <div className="contants">
                    {movies.map((movie)=>  <Moviecard  key = {movie.title} movie = {movie} />)}
                </div> 
            </section>

            
            <section className="under_contant">
                <div className="very_under_contant">
                    <div> <span className="span-label"> The label </span> <h2> upcomming events</h2></div>
                    <Link to="/events" className="view"> View ALL </Link>
                </div>
                <div className="contants">
                    {event.map((event)=> <Eventcard key = {event.title} event ={event} />)}
                </div>
            </section>
        </main>
      </>
      
    );
}

export default Home;
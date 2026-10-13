import { Link } from "react-router-dom";

function Eventcard({ event }) {
  return (
    <article className="event-card">
      <img src={event.image} alt={event.title} className="card-image" />
      <div className="card-content">
        <span className="event-date">{event.date}</span>
        <h3>{event.title}</h3>
        <p>{event.venue}</p>
        <div className="event-bottom">
          <strong>From ₹{event.price || event.entry_fee }</strong>
          <Link to="/bookings" className="small-btn">Book</Link>
        </div>
      </div>
    </article>
  );
}

export default Eventcard;
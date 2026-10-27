import { Link } from "react-router-dom";
import { fallbackImage } from "../data/catalog";

function Eventcard({ event }) {
  return (
    <article className="event-card">
      <img
        src={event.image}
        alt={`${event.title} event`}
        className="card-image"
        loading="lazy"
        onError={(imageEvent) => {
          imageEvent.currentTarget.onerror = null;
          imageEvent.currentTarget.src = fallbackImage;
        }}
      />
      <div className="card-content">
        <span className="event-date">{event.date}</span>
        <h3>{event.title}</h3>
        <p>{event.venue}</p>
        <div className="event-bottom">
          <strong>
            {Number.isFinite(event.price)
              ? `From ₹${event.price.toLocaleString("en-IN")}`
              : "Price unavailable"}
          </strong>
          <Link
            to="/seats"
            state={{
              itemType: "event",
              itemTitle: event.title,
              unitPrice: event.price
            }}
            className="small-btn"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Eventcard;
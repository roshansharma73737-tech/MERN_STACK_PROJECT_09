import Eventcard from "../components/eventcard";

const events = [
  { title: "Live Music Festival", date: "20 SEP", venue: "Riverfront Arena", price: 799, image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80" },
  { title: "Comedy Night", date: "27 SEP", venue: "City Convention Hall", price: 499, image: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=800&q=80" },
  { title: "Tech Expo 2026", date: "04 OCT", venue: "Expo Center", price: 299, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" },
  { title: "Art & Culture Fest", date: "11 OCT", venue: "City Art Gallery", price: 399, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80" },
  { title: "Winter Night Club Fest", date: "07 dec" ,venue: "Gift city ghandhinagar", entry_fee : "500", image : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80" }
];

function Events(){
    return (
        <main className="event-1">
            <div className="event-2">
                <span className="event-3"> Live Exprience </span>
                <h2> UPComming Events </h2>
                <p>music ,comedy , technology and more.</p>
            </div>
            <div className="main8"> {events.map((event)=> <Eventcard key={event.title} event = {event} />)} </div>
        </main>
    );
}   

export default Events;
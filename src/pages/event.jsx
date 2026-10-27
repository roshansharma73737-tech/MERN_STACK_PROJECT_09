import Eventcard from "../components/eventcard";
import { events } from "../data/catalog";

function Events(){
    return (
        <main className="event-1">
            <div className="event-2">
                <span className="event-3">Live experiences</span>
                <h2>Upcoming events</h2>
                <p>Music, comedy, culture, technology, and more.</p>
            </div>
            <div className="main8"> {events.map((event)=> <Eventcard key={event.title} event = {event} />)} </div>
        </main>
    );
}   

export default Events;
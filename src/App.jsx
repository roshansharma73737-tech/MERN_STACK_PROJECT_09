import { Routes, Route } from "react-router-dom";

import Navigator from "./components/navigator";

import Home from "./pages/home";
import Events from "./pages/event";
import Movies from "./pages/movies";
import Login from "./pages/login";
import Booking from "./pages/booking";
import Ticket from "./pages/ticket";

function App() {
  return (
    <div className="app">

      <Navigator />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route path="/movies" element={<Movies />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/login" element={<Login />} />

        <Route path="/Ticket/generation" element ={<Ticket />} />

      </Routes>

    </div>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";

import Navigator from "./components/navigator";

import Home from "./pages/home";
import Events from "./pages/event";
import Movies from "./pages/movies";
import Login from "./pages/login";
import Booking from "./pages/booking";
import Ticket from "./pages/ticket";
import Signup from "./pages/signup";
import Seats from "./pages/seats";
import Payment from "./pages/payments";
import { PaymentCancelled, PaymentSuccess } from "./pages/payment-result";
import Footer from "./components/foolter";

function App() {
  return (
    <div className="app">

      <Navigator />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route path="/movies" element={<Movies />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/bookings" element={<Booking />} />

        <Route path="/seats" element={<Seats />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/payment/success" element={<PaymentSuccess />} />

        <Route path="/payment/cancelled" element={<PaymentCancelled />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/ticket/:ticketId" element={<Ticket />} />

        <Route path="/ticket/generation" element={<Ticket />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;
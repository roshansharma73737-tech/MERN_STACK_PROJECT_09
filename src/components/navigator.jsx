
import { NavLink } from "react-router-dom";

function Navigator() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <NavLink to="/" className="logo">
          TICKETLY
        </NavLink>

        <nav className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Booking
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            className="signup-button"
          >
            Sign Up
          </NavLink>

        </nav>

      </div>
    </header>
  );
}

export default Navigator;
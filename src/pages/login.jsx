import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/Authentication/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (!data?.token) {
        throw new Error("The server did not return an authentication token.");
      }

      localStorage.setItem("ticketly_token", data.token);
      if (data.user) localStorage.setItem("ticketly_user", JSON.stringify(data.user));

      setMessage("Login successful!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-card">

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Login to your TICKETLY account
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>


            {/* Message */}

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}


            {/* Login Button */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>


          {/* Signup */}

          <p className="signup-text">

            Don't have an account?{" "}

            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
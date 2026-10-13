import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
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

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Store authentication information
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Login successful!");

      // Go to home page
      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to server. Please start the backend."
      );
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

            <button
              type="button"
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
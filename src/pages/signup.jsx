
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await apiRequest("/Authentication/signup", {
                method: "POST",
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                })
            });

            navigate("/login", {
                state: { message: "Account created. Please sign in." }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-card signup-card" onSubmit={handleSubmit}>
                <Link to="/" className="brand signup-brand">
                    <span className="brand-icon">T</span>
                    Ticketly
                </Link>

                <span className="eyebrow">YOUR NEXT EXPERIENCE STARTS HERE</span>

                <h1>Create your account</h1>

                <p>Join Ticketly and keep your bookings in one place.</p>

                <label htmlFor="signup-name">Full name</label>
                <input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={100}
                    required
                />

                <label htmlFor="signup-email">Email address</label>
                <input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                />

                <label htmlFor="signup-confirm-password">
                    Confirm password
                </label>
                <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter your password again"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button
                    type="submit"
                    className="button full-width"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

                <p className="auth-bottom">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>

                <p className="signup-terms">
                    Your account details are sent to the Ticketly backend.
                </p>
            </form>
        </main>
    );
}

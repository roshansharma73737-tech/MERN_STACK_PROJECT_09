import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="site-footer">
            <Link to="/" className="site-footer-brand">TICKETLY</Link>
            <p>Find your next experience.</p>
            <span>© {new Date().getFullYear()} Ticketly</span>
        </footer>
    );
}

export default Footer;
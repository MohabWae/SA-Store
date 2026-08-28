import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            S<span>&</span>A
          </Link>

          <p>
            Premium supplements for your training,
            performance, and goals.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-links">
          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <a
            href="https://wa.me/201033667327"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>

          <p>Egypt</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} S&A Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
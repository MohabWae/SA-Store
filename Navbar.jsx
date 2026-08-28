import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const ADMIN_UID = "VqXfAoTc4UNQeMu6Q95k2hzhJuo1";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAdmin = currentUser && currentUser.uid === ADMIN_UID;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          S&A <span>STORE</span>
        </Link>

        {/* Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          {/* زرار الأدمن يظهر فقط لو أنت الأدمن */}
          {isAdmin && (
            <Link to="/admin" className="admin-link-badge">
              ⚙️ Admin Dashboard
            </Link>
          )}

          {/* التحكم بالحساب والتسجيل */}
          {currentUser ? (
            <button type="button" onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-login-nav">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
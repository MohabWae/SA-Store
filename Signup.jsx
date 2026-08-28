import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const ADMIN_UID = "VqXfAoTc4UNQeMu6Q95k2hzhJuo1";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // =========================
  // EMAIL SIGN UP
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save name in Firebase Authentication
      await updateProfile(user, {
        displayName: name,
      });

      // Save user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        phone: phone,
        email: email,
        role: user.uid === ADMIN_UID ? "admin" : "user",
        createdAt: new Date().toISOString(),
      });

      if (user.uid === ADMIN_UID) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Could not create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE SIGN UP
  // =========================
  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save Google user in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          phone: "",
          email: user.email || "",
          role: user.uid === ADMIN_UID ? "admin" : "user",
          createdAt: new Date().toISOString(),
        },
        {
          merge: true,
        }
      );

      if (user.uid === ADMIN_UID) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign up was cancelled.");
      } else {
        setError("Could not sign up with Google.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <span>S&A STORE</span>
          <h1>Create Account</h1>
          <p>Create your account and start shopping.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* ERROR */}
          {error && <p className="auth-error">{error}</p>}

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading || googleLoading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
        >
          <span className="google-icon">G</span>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* LOGIN */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;
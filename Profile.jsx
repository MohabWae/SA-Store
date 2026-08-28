import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        try {
          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setName(
              data.name ||
                currentUser.displayName ||
                ""
            );

            setPhone(data.phone || "");

            setEmail(
              data.email ||
                currentUser.email ||
                ""
            );
          } else {
            setName(
              currentUser.displayName || ""
            );

            setEmail(
              currentUser.email || ""
            );
          }
        } catch (err) {
          console.error(
            "Failed to load profile:",
            err
          );

          setError(
            "Could not load your profile."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);


  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (
      phone &&
      !/^[0-9+\-\s]{8,15}$/.test(phone)
    ) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!user) {
      return;
    }

    setSaving(true);

    try {
      // Update Firebase Authentication name
      await updateProfile(user, {
        displayName: name.trim(),
      });

      // Update Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: name.trim(),
          phone: phone.trim(),
          email: email,
        },
        {
          merge: true,
        }
      );

      setMessage(
        "Your profile has been updated successfully."
      );
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        "Could not update your profile."
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <main className="profile-page">
        <p className="profile-loading">
          Loading profile...
        </p>
      </main>
    );
  }


  return (
    <main className="profile-page">

      <section className="profile-card">

        {/* AVATAR */}

        <div className="profile-avatar">
          {(name || email || "U")
            .charAt(0)
            .toUpperCase()}
        </div>


        {/* HEADER */}

        <div className="profile-header">

          <span>MY ACCOUNT</span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your S&A account information.
          </p>

        </div>


        {/* FORM */}

        <form
          className="profile-form"
          onSubmit={handleSave}
        >

          {/* NAME */}

          <div className="profile-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

          </div>


          {/* PHONE */}

          <div className="profile-field">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
            />

          </div>


          {/* EMAIL */}

          <div className="profile-field">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled
            />

            <small>
              Your email cannot be changed here.
            </small>

          </div>


          {/* ERROR */}

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}


          {/* SUCCESS */}

          {message && (
            <p className="profile-success">
              {message}
            </p>
          )}


          {/* SAVE */}

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>


        {/* HOME */}

        <Link
          to="/"
          className="profile-home-btn"
        >
          Back to Home
        </Link>

      </section>

    </main>
  );
}

export default Profile;
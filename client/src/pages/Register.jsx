
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, User, Mail, Phone, Lock } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("owners") || "[]");

    const exists = users.some(
      (user) => user.email === form.email
    );

    if (exists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...form
    };

    localStorage.setItem(
      "owners",
      JSON.stringify([...users, newUser])
    );

    localStorage.setItem("currentOwner", JSON.stringify(newUser));

    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <PawPrint size={35} />
          <h2>PetCare AI</h2>
        </div>

        <h1>Create Account</h1>
        <p>Join us and take better care of your pets.</p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <div className="auth-input">
            <User size={19} />
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <label>Phone Number</label>
          <div className="auth-input">
            <Phone size={19} />
            <input
              type="tel"
              placeholder="Your phone number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Create a password"
              minLength={6}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

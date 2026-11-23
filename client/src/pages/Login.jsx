
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("owners") || "[]");

    const user = users.find(
      (u) =>
        u.email === form.email &&
        u.password === form.password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem("currentOwner", JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <PawPrint size={35} />
          <h2>PetCare AI</h2>
        </div>

        <h1>Welcome Back!</h1>
        <p>Sign in to manage your pets' health.</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

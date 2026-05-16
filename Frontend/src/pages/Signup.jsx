import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/dashboard");
      dispatch(reset());
    }
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (!isEmailValid(email)) {
      alert("Invalid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-split">
        <div className="auth-side auth-side-signup">
          <img className="auth-logo" src={heroImage} alt="ICT Solutions logo" />
          <div className="auth-company">ICT Solutions Pvt Ltd</div>
          <div className="auth-tag">Project Data 2026</div>
          <h1>Start your workspace</h1>
          <p>
            Create your account to manage assigned projects, daily reports, and
            yearly progress from one clean dashboard.
          </p>
          <div className="auth-highlight-grid">
            <span>Role based access</span>
            <span>Team dashboards</span>
            <span>Project tracking</span>
          </div>
        </div>

        <div className="auth-main">
          <div className="auth-header">
            <span>Create account</span>
            <h2>Join DataLive</h2>
            <p>Use your work email and a secure password to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Full name</label>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <div className="password-field">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="password-toggle"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <label>Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {isError && (
              <div className="auth-alert">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

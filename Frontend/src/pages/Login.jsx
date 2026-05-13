import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  // 🔹 Handle auth state changes
useEffect(() => {
  if (isSuccess || user) {
    navigate("/dashboard");
    dispatch(reset()); // ✅ sirf success pe
  }

  if (isError) {
    console.error(message);
  }
}, [user, isError, isSuccess, message, dispatch, navigate]);

  // 🔹 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }

    if (!isEmailValid(email)) {
      alert("Please enter a valid email");
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-split">

        {/* 🔹 Left Side */}
        <div className="auth-side">
          <img className="auth-logo" src={heroImage} alt="ICT Solutions logo" />
          <div className="auth-company">ICT Solutions Pvt Ltd</div>
          <div className="auth-tag">Project Data 2026</div>
          <h1>Welcome back</h1>
          <p>
            Sign in to continue managing your projects, tracking hours, and
            reviewing analytics in one place.
          </p>
          <div className="auth-highlight">Fast. Secure. Responsive.</div>
        </div>

        {/* 🔹 Right Side */}
        <div className="auth-main">
          <div className="auth-header">
            <span>Sign in</span>
            <h2>Secure access</h2>
            <p>Enter your credentials to access the dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            
            <label>Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* 🔴 Error Message */}
            {isError && (
              <div className="auth-alert">
                {message}
              </div>
            )}

            {/* 🔵 Loading */}
            <button
              className="primary-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>

            <div className="auth-footer">
              <span>New here?</span>
              <Link to="/signup">Create an account</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

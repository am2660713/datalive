import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import authService from "../features/auth/authService";

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    email: "",
    resetCode: "",
    newPassword: "",
  });
  const [forgotMessage, setForgotMessage] = useState("");
  const [visibleResetCode, setVisibleResetCode] = useState("");

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

  const requestResetCode = async () => {
    if (!forgotForm.email || !isEmailValid(forgotForm.email)) {
      setForgotMessage("Please enter a valid email.");
      return;
    }

    try {
      const result = await authService.forgotPassword(forgotForm.email);
      setForgotForm((prev) => ({ ...prev, resetCode: result.resetCode || "" }));
      setVisibleResetCode(result.resetCode || "");
      setForgotMessage(
        result.resetCode
          ? `Reset code: ${result.resetCode}. Enter a new password below.`
          : result.message
      );
    } catch (error) {
      setForgotMessage(error.response?.data?.message || "Unable to create reset code.");
    }
  };

  const submitNewPassword = async () => {
    if (!forgotForm.email || !forgotForm.resetCode || !forgotForm.newPassword) {
      setForgotMessage("Email, reset code, and new password are required.");
      return;
    }

    try {
      const result = await authService.resetPassword(forgotForm);
      setForgotMessage(result.message || "Password reset successfully.");
      setPassword("");
      setForgotForm({ email: "", resetCode: "", newPassword: "" });
      setVisibleResetCode("");
    } catch (error) {
      setForgotMessage(error.response?.data?.message || "Unable to reset password.");
    }
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

            <button
              type="button"
              className="forgot-link"
              onClick={() => {
                setForgotOpen(true);
                setForgotForm((prev) => ({ ...prev, email: email || prev.email }));
                setForgotMessage("");
                setVisibleResetCode("");
              }}
            >
              Forgot password?
            </button>

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

      {forgotOpen && (
        <div className="modal" role="dialog" style={{ display: "flex" }}>
          <div className="panel password-panel">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Account email"
              value={forgotForm.email}
              onChange={(event) =>
                setForgotForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <button type="button" className="ribbon-btn active" onClick={requestResetCode}>
              Get Reset Code
            </button>
            {visibleResetCode && (
              <div className="reset-code-box">
                <span>Your reset code</span>
                <strong>{visibleResetCode}</strong>
              </div>
            )}
            <input
              type="text"
              placeholder="Reset code"
              value={forgotForm.resetCode}
              onChange={(event) =>
                setForgotForm((prev) => ({ ...prev, resetCode: event.target.value }))
              }
            />
            <input
              type="password"
              placeholder="New password"
              value={forgotForm.newPassword}
              onChange={(event) =>
                setForgotForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
            />
            {forgotMessage && <p className="password-message">{forgotMessage}</p>}
            <div className="actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setForgotOpen(false)}>
                Close
              </button>
              <button className="modal-btn modal-btn-primary" onClick={submitNewPassword}>
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import authService from "../features/auth/authService.js";

export default function Topbar() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const roleLabel =
    user?.role === "admin" ? "Admin" : user?.role === "manager" ? "Manager" : "Employee";

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordMessage("");
      await authService.changePassword(passwordForm, token);
      setPasswordMessage("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setPasswordMessage(error.response?.data?.message || "Unable to change password");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
        <div className="topbar-logo-text">
          <span className="logo-brand">ICT Solutions Pvt Ltd</span>
          <span className="logo-subtitle">Project Data 2026</span>
        </div>
      </div>
      <div className="topbar-user">
        <span>{user?.name || "Guest"}</span>
        {user && <span className="role-badge">{roleLabel}</span>}
        {user ? (
          <>
            <button onClick={() => setPasswordOpen(true)} className="btn btn-ghost btn-small">
              Password
            </button>
            <button onClick={handleLogout} className="btn btn-ghost btn-small">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-ghost btn-small">
            Login
          </Link>
        )}
      </div>
      {passwordOpen && (
        <div className="modal" role="dialog" style={{ display: "flex" }}>
          <div className="panel password-panel">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
            />
            {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            <div className="actions">
              <button className="ribbon-btn" onClick={() => setPasswordOpen(false)}>
                Close
              </button>
              <button className="ribbon-btn active" onClick={handlePasswordChange}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

export default function Topbar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
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
        {user ? (
          <button onClick={handleLogout} className="btn btn-ghost btn-small">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-ghost btn-small">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

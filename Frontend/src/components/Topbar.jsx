import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

export default function Topbar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roleLabel =
    user?.role === "admin" ? "Admin" : user?.role === "manager" ? "Manager" : "Employee";

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="topbar">
      <div className="topbar-welcome">
        <span>Workspace</span>
        <strong>Welcome, {user?.name || "Guest"}</strong>
      </div>
      <div className="topbar-user">
        {user && <span className="role-badge">{roleLabel}</span>}
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

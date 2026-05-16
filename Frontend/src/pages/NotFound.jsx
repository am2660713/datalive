import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page you opened does not exist. Go back to the dashboard or sign in again.</p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="primary-button">Dashboard</Link>
          <Link to="/login" className="modal-btn modal-btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  );
}

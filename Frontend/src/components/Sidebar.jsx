import { useSelector } from "react-redux";
import { useAppContext } from "../context/AppContext";

const navItems = [
  {
    key: "projects",
    label: "Projects",
    eyebrow: "Tracking",
    icon: "P",
  },
  {
    key: "daily",
    label: "Daily Report",
    eyebrow: "Timesheet",
    icon: "D",
  },
  {
    key: "yearly",
    label: "Yearly Summary",
    eyebrow: "Analytics",
    icon: "Y",
  },
  {
    key: "admin",
    label: "Admin",
    eyebrow: "Control",
    icon: "A",
    adminOnly: true,
  },
];

export default function Sidebar() {
  const { activeSheet, switchSheet, summary } = useAppContext();
  const user = useSelector((state) => state.auth.user);
  const visibleItems = navItems.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">DL</div>
        <div>
          <span>DataLive</span>
          <strong>Project Suite</strong>
        </div>
      </div>

      <div className="sidebar-user-card">
        <span className="sidebar-kicker">Signed in as</span>
        <strong>{user?.name || "Guest User"}</strong>
        <small>{user?.role || "employee"} workspace</small>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard pages">
        {visibleItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar-nav-item ${activeSheet === item.key ? "active" : ""}`}
            onClick={() => switchSheet(item.key)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-copy">
              <strong>{item.label}</strong>
              <small>{item.eyebrow}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-mini-stats">
        <div>
          <span>{summary.total || 0}</span>
          <small>Projects</small>
        </div>
        <div>
          <span>{summary.hours || 0}</span>
          <small>Hours</small>
        </div>
      </div>
    </aside>
  );
}

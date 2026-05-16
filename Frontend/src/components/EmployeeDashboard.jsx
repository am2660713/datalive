import { useSelector } from "react-redux";
import SummaryCards from "./SummaryCards";

export default function EmployeeDashboard() {
  const projects = useSelector((state) => state.projects.projects);
  const overdue = projects.filter(
    (project) =>
      project.deadline &&
      project.status !== "Delivered" &&
      new Date(project.deadline) < new Date()
  );
  const completed = projects.filter((project) => project.status === "Delivered");
  const totalHours = projects.reduce((sum, project) => sum + (Number(project.hours) || 0), 0);

  return (
    <div className="employee-dashboard">
      <div className="admin-panel-header">
        <div>
          <span className="daily-kicker">Employee</span>
          <h2>My Work Dashboard</h2>
        </div>
        <p>Quick overview of assigned projects, deadlines, and completed work.</p>
      </div>

      <SummaryCards />

      <div className="admin-stat-grid">
        <div className="stat-card">
          <div className="stat-val">{projects.length}</div>
          <div className="stat-lbl">My Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{overdue.length}</div>
          <div className="stat-lbl">Overdue</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{completed.length}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{totalHours}</div>
          <div className="stat-lbl">Assigned Hours</div>
        </div>
      </div>
    </div>
  );
}

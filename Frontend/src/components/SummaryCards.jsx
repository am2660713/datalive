import { useSelector } from "react-redux";

export default function SummaryCards() {
  const { employees, managers, projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const total = projects.length;
  const delivered = projects.filter(p => p.status === "Delivered").length;
  const inProgress = projects.filter(p => p.status === "In Progress").length;
  const blocked = projects.filter(p => p.status === "Blocked").length;
  const urgent = projects.filter(p => ["High", "Urgent"].includes(p.priority)).length;
  const overdue = projects.filter((p) => {
    if (!p.deadline || p.status === "Delivered") return false;
    return new Date(p.deadline) < new Date();
  }).length;
  const hours = projects.reduce((sum, p) => sum + (Number(p.hours) || 0), 0);
  const clients = new Set(projects.map(p => p.client)).size;
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  return (
    <div className="summary-bar">
      <div className="stat-card">
        <div className="stat-val">{total}</div>
        <div className="stat-lbl">Total Projects</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{delivered}</div>
        <div className="stat-lbl">Delivered</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{inProgress}</div>
        <div className="stat-lbl">In Progress</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{blocked}</div>
        <div className="stat-lbl">Blocked</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{urgent}</div>
        <div className="stat-lbl">High Priority</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{overdue}</div>
        <div className="stat-lbl">Overdue</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{hours}</div>
        <div className="stat-lbl">Total Hours</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{clients}</div>
        <div className="stat-lbl">Clients</div>
      </div>

      {isAdmin && (
        <div className="stat-card">
          <div className="stat-val">{managers.length}</div>
          <div className="stat-lbl">Managers</div>
        </div>
      )}

      {(isAdmin || isManager) && (
        <div className="stat-card">
          <div className="stat-val">{employees.filter((employee) => employee.role === "employee").length}</div>
          <div className="stat-lbl">{isAdmin ? "Employees" : "My Team"}</div>
        </div>
      )}
    </div>
  );
}

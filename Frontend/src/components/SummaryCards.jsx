import { useSelector } from "react-redux";

export default function SummaryCards() {
  const { projects } = useSelector((state) => state.projects);

  const total = projects.length;
  const delivered = projects.filter(p => p.status === "Delivered").length;
  const inProgress = projects.filter(p => p.status === "In Progress").length;
  const hours = projects.reduce((sum, p) => sum + (Number(p.hours) || 0), 0);
  const clients = new Set(projects.map(p => p.client)).size;

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
        <div className="stat-val">{hours}</div>
        <div className="stat-lbl">Total Hours</div>
      </div>

      <div className="stat-card">
        <div className="stat-val">{clients}</div>
        <div className="stat-lbl">Clients</div>
      </div>
    </div>
  );
}
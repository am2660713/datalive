import { useMemo } from "react";
import { useSelector } from "react-redux";

const statuses = ["Delivered", "In Progress", "Pending Approval", "Blocked"];
const priorities = ["Low", "Medium", "High", "Urgent"];

const emptyMetric = () => ({
  projects: 0,
  hours: 0,
  delivered: 0,
  inProgress: 0,
  blocked: 0,
  overdue: 0,
});

const isOverdue = (project) =>
  project.deadline &&
  project.status !== "Delivered" &&
  new Date(project.deadline) < new Date();

const addProjectToGroup = (group, project) => {
  group.projects += 1;
  group.hours += Number(project.hours) || 0;
  if (project.status === "Delivered") group.delivered += 1;
  if (project.status === "In Progress") group.inProgress += 1;
  if (project.status === "Blocked") group.blocked += 1;
  if (isOverdue(project)) group.overdue += 1;
};

const completionRate = (group) =>
  group.projects ? Math.round((group.delivered / group.projects) * 100) : 0;

export default function ReportsPanel() {
  const projects = useSelector((state) => state.projects.projects);

  const reports = useMemo(() => {
    const byEmployee = {};
    const byManager = {};
    const byMonth = {};
    const byStatus = Object.fromEntries(statuses.map((status) => [status, emptyMetric()]));
    const byPriority = Object.fromEntries(priorities.map((priority) => [priority, emptyMetric()]));
    const overdue = [];

    const totals = projects.reduce(
      (acc, project) => {
        addProjectToGroup(acc, project);
        if (["High", "Urgent"].includes(project.priority)) acc.highPriority += 1;
        return acc;
      },
      { ...emptyMetric(), highPriority: 0 }
    );

    projects.forEach((project) => {
      const employee = project.user?.name || "Unassigned";
      const manager = project.assignedBy?.name || "Not assigned";
      const month = project.createdAt
        ? new Date(project.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" })
        : "Unknown";
      const status = project.status || "In Progress";
      const priority = project.priority || "Medium";

      byEmployee[employee] ||= emptyMetric();
      byManager[manager] ||= emptyMetric();
      byMonth[month] ||= emptyMetric();
      byStatus[status] ||= emptyMetric();
      byPriority[priority] ||= emptyMetric();

      addProjectToGroup(byEmployee[employee], project);
      addProjectToGroup(byManager[manager], project);
      addProjectToGroup(byMonth[month], project);
      addProjectToGroup(byStatus[status], project);
      addProjectToGroup(byPriority[priority], project);

      if (isOverdue(project)) overdue.push(project);
    });

    return { byEmployee, byManager, byMonth, byStatus, byPriority, overdue, totals };
  }, [projects]);

  const exportCSV = (name, rows) => {
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name}.csv`;
    link.click();
  };

  const groupRows = (data) =>
    Object.entries(data).map(([label, metric]) => [
      label,
      metric.projects,
      metric.hours,
      `${completionRate(metric)}%`,
      metric.overdue,
    ]);

  const renderGroupTable = (title, data, fileName) => {
    const rows = groupRows(data);
    return (
      <div className="report-card">
        <div className="report-card-head">
          <h3>{title}</h3>
          <button
            className="btn btn-small btn-secondary"
            onClick={() =>
              exportCSV(fileName, [["Name", "Projects", "Hours", "Completion", "Overdue"], ...rows])
            }
          >
            Export
          </button>
        </div>
        <div className="report-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Projects</th>
                <th>Hours</th>
                <th>Done</th>
                <th>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="5">No data available</td></tr>
              ) : (
                rows.map(([label, count, hours, done, overdue]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{count}</td>
                    <td>{hours}</td>
                    <td>
                      <div className="report-progress">
                        <span style={{ width: done }}></span>
                      </div>
                      {done}
                    </td>
                    <td>{overdue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="reports-panel">
      <div className="admin-panel-header report-hero">
        <div>
          <span className="daily-kicker">Reports</span>
          <h2>Project Intelligence</h2>
        </div>
        <p>Track workload, completion, overdue risk, status health, and priority pressure in one place.</p>
      </div>

      <div className="report-summary-grid">
        <div className="stat-card">
          <div className="stat-val">{reports.totals.projects}</div>
          <div className="stat-lbl">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{reports.totals.hours}</div>
          <div className="stat-lbl">Total Hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{completionRate(reports.totals)}%</div>
          <div className="stat-lbl">Completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{reports.totals.overdue}</div>
          <div className="stat-lbl">Overdue</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{reports.totals.highPriority}</div>
          <div className="stat-lbl">High Priority</div>
        </div>
      </div>

      <div className="report-grid report-grid-wide">
        {renderGroupTable("Employee Performance", reports.byEmployee, "employee-report")}
        {renderGroupTable("Manager Workload", reports.byManager, "manager-report")}
        {renderGroupTable("Monthly Trend", reports.byMonth, "monthly-report")}
        {renderGroupTable("Status Breakdown", reports.byStatus, "status-report")}
        {renderGroupTable("Priority Breakdown", reports.byPriority, "priority-report")}

        <div className="report-card">
          <div className="report-card-head">
            <h3>Overdue Projects</h3>
            <button
              className="btn btn-small btn-danger"
              onClick={() =>
                exportCSV("overdue-report", [
                  ["Project", "Employee", "Manager", "Deadline", "Priority"],
                  ...reports.overdue.map((project) => [
                    project.name,
                    project.user?.name || "-",
                    project.assignedBy?.name || "-",
                    project.deadline ? new Date(project.deadline).toLocaleDateString() : "-",
                    project.priority || "Medium",
                  ]),
                ])
              }
            >
              Export
            </button>
          </div>
          <div className="report-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Employee</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {reports.overdue.length === 0 ? (
                  <tr><td colSpan="4">No overdue projects</td></tr>
                ) : (
                  reports.overdue.map((project) => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>{project.user?.name || "-"}</td>
                      <td>{new Date(project.deadline).toLocaleDateString()}</td>
                      <td>
                        <span className={`priority-pill priority-${(project.priority || "Medium").toLowerCase()}`}>
                          {project.priority || "Medium"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

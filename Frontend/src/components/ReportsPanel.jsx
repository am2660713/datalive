import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function ReportsPanel() {
  const projects = useSelector((state) => state.projects.projects);

  const reports = useMemo(() => {
    const byEmployee = {};
    const byManager = {};
    const byMonth = {};
    const overdue = [];

    projects.forEach((project) => {
      const employee = project.user?.name || "Unassigned";
      const manager = project.assignedBy?.name || "Not assigned";
      const month = project.createdAt
        ? new Date(project.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" })
        : "Unknown";

      byEmployee[employee] = (byEmployee[employee] || 0) + 1;
      byManager[manager] = (byManager[manager] || 0) + 1;
      byMonth[month] = (byMonth[month] || 0) + 1;

      if (project.deadline && project.status !== "Delivered" && new Date(project.deadline) < new Date()) {
        overdue.push(project);
      }
    });

    return { byEmployee, byManager, byMonth, overdue };
  }, [projects]);

  const renderRows = (data) =>
    Object.entries(data).map(([label, count]) => (
      <tr key={label}>
        <td>{label}</td>
        <td>{count}</td>
      </tr>
    ));

  return (
    <div className="reports-panel">
      <div className="admin-panel-header">
        <div>
          <span className="daily-kicker">Reports</span>
          <h2>Project Reports</h2>
        </div>
        <p>Employee-wise, manager-wise, monthly, and overdue project summaries.</p>
      </div>

      <div className="report-grid">
        <div className="summary-table-wrapper">
          <h3>Employee-wise</h3>
          <table><tbody>{renderRows(reports.byEmployee)}</tbody></table>
        </div>
        <div className="summary-table-wrapper">
          <h3>Manager-wise</h3>
          <table><tbody>{renderRows(reports.byManager)}</tbody></table>
        </div>
        <div className="summary-table-wrapper">
          <h3>Monthly</h3>
          <table><tbody>{renderRows(reports.byMonth)}</tbody></table>
        </div>
        <div className="summary-table-wrapper">
          <h3>Overdue</h3>
          <table>
            <tbody>
              {reports.overdue.length === 0 ? (
                <tr><td>No overdue projects</td><td>0</td></tr>
              ) : (
                reports.overdue.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{new Date(project.deadline).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

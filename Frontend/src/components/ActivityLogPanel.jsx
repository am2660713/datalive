import { useSelector } from "react-redux";

const actionLabels = {
  PROJECT_CREATED: "Created",
  PROJECT_UPDATED: "Updated",
  PROJECT_DELETED: "Deleted",
  MANAGER_ASSIGNED: "Team",
};

export default function ActivityLogPanel() {
  const { activityLogs } = useSelector((state) => state.projects);

  return (
    <div className="activity-panel">
      <div className="admin-panel-header">
        <div>
          <span className="daily-kicker">Admin</span>
          <h2>Activity Logs</h2>
        </div>
        <p>Track important actions like project changes and manager assignments.</p>
      </div>

      <div className="activity-list">
        {activityLogs.length === 0 ? (
          <div className="daily-empty-state">
            <div className="daily-empty-card">
              <strong>No activity yet</strong>
              <p>New project and team actions will appear here automatically.</p>
            </div>
          </div>
        ) : (
          activityLogs.map((log) => (
            <div className="activity-item" key={log._id}>
              <span className={`activity-badge ${log.action?.toLowerCase()}`}>
                {actionLabels[log.action] || "Log"}
              </span>
              <div className="activity-copy">
                <strong>{log.message}</strong>
                <small>
                  {new Date(log.createdAt).toLocaleString()} by {log.actor?.name || "System"}
                </small>
              </div>
              {log.project?.priority && (
                <span className={`priority-pill priority-${log.project.priority.toLowerCase()}`}>
                  {log.project.priority}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

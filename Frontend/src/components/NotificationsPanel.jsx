import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function NotificationsPanel() {
  const projects = useSelector((state) => state.projects.projects);

  const notifications = useMemo(() => {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + 7);

    return projects
      .flatMap((project) => {
        const items = [];
        const deadline = project.deadline ? new Date(project.deadline) : null;
        if (deadline && project.status !== "Delivered" && deadline < today) {
          items.push({
            type: "urgent",
            title: "Project overdue",
            text: `${project.name} deadline has passed.`,
          });
        } else if (deadline && project.status !== "Delivered" && deadline <= soon) {
          items.push({
            type: "warning",
            title: "Deadline near",
            text: `${project.name} is due by ${deadline.toLocaleDateString()}.`,
          });
        }
        if (["High", "Urgent"].includes(project.priority)) {
          items.push({
            type: "priority",
            title: "High priority project",
            text: `${project.name} is marked ${project.priority}.`,
          });
        }
        return items;
      })
      .slice(0, 20);
  }, [projects]);

  return (
    <div className="activity-panel">
      <div className="admin-panel-header">
        <div>
          <span className="daily-kicker">Alerts</span>
          <h2>Notifications</h2>
        </div>
        <p>Important deadline and priority alerts from your current projects.</p>
      </div>

      <div className="activity-list">
        {notifications.length === 0 ? (
          <div className="daily-empty-state">
            <div className="daily-empty-card">
              <strong>No alerts right now</strong>
              <p>Deadline and priority notifications will appear here.</p>
            </div>
          </div>
        ) : (
          notifications.map((item, index) => (
            <div className="activity-item" key={`${item.title}-${index}`}>
              <span className={`activity-badge notify-${item.type}`}>{item.title}</span>
              <div className="activity-copy">
                <strong>{item.text}</strong>
                <small>Generated from project priority and deadline</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

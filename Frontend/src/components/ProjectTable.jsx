import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProject, updateProject } from "../features/projects/projectSlice";
import { useAppContext } from "../context/AppContext";

export default function ProjectTable() {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const { filteredProjects, filters, filtersVisible, setFilters } = useAppContext();
  const user = useSelector((state) => state.auth.user);

  const showAssignedTo = ["admin", "manager"].includes(user?.role);
  const canManageProjects = ["admin", "manager"].includes(user?.role);
  const filterFields = {
    f1: "Project",
    f2: "Client",
    f3: "Product",
    f4: "Job type",
    f6: "WEB",
    f7: "Status",
    f8: "Timesheet",
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditValues({
      name: project.name || "",
      client: project.client || "",
      product: project.product || "",
      jobType: project.jobType || "",
      hours: project.hours ?? "",
      web: project.web || "",
      status: project.status || "Delivered",
      timesheet: project.timesheet || "Delivered",
      priority: project.priority || "Medium",
      deadline: project.deadline ? String(project.deadline).slice(0, 10) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async () => {
    if (!editValues.name || !editValues.client || !editValues.product) {
      alert("Project name, client, and product line are required.");
      return;
    }

    await dispatch(
      updateProject({
        id: editingId,
        data: {
          ...editValues,
          hours: Number(editValues.hours) || 0,
        },
      })
    );

    setEditingId(null);
    setEditValues({});
  };

  const handleFieldChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Client</th>
            <th>Product Line</th>
            <th>Job Type</th>
            <th>Total Hours</th>
            <th>WEB</th>
            <th>Status</th>
            <th>Timesheet</th>
            <th>Priority</th>
            <th>Deadline</th>
            {showAssignedTo && <th>Assigned To</th>}
            {showAssignedTo && <th>Assigned By</th>}
            {canManageProjects && <th>Actions</th>}
          </tr>
          {filtersVisible && (
            <tr className="filter-row">
              <th></th>
              <th><input className="filter-input" value={filters.f1 || ""} placeholder={filterFields.f1} onChange={(e) => updateFilter("f1", e.target.value)} /></th>
              <th><input className="filter-input" value={filters.f2 || ""} placeholder={filterFields.f2} onChange={(e) => updateFilter("f2", e.target.value)} /></th>
              <th><input className="filter-input" value={filters.f3 || ""} placeholder={filterFields.f3} onChange={(e) => updateFilter("f3", e.target.value)} /></th>
              <th><input className="filter-input" value={filters.f4 || ""} placeholder={filterFields.f4} onChange={(e) => updateFilter("f4", e.target.value)} /></th>
              <th></th>
              <th><input className="filter-input" value={filters.f6 || ""} placeholder={filterFields.f6} onChange={(e) => updateFilter("f6", e.target.value)} /></th>
              <th><input className="filter-input" value={filters.f7 || ""} placeholder={filterFields.f7} onChange={(e) => updateFilter("f7", e.target.value)} /></th>
              <th><input className="filter-input" value={filters.f8 || ""} placeholder={filterFields.f8} onChange={(e) => updateFilter("f8", e.target.value)} /></th>
              <th></th>
              <th></th>
              {showAssignedTo && <th></th>}
              {showAssignedTo && <th></th>}
              {canManageProjects && <th></th>}
            </tr>
          )}
        </thead>

        <tbody>
          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan={(showAssignedTo ? 13 : 11) + (canManageProjects ? 1 : 0)} style={{ textAlign: "center" }}>
                No Projects Found
              </td>
            </tr>
          ) : (
            filteredProjects.map((project, index) => {
              const isEditing = editingId === project._id;

              return (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{isEditing ? <input className="table-input" value={editValues.name} onChange={(e) => handleFieldChange("name", e.target.value)} /> : project.name}</td>
                  <td>{isEditing ? <input className="table-input" value={editValues.client} onChange={(e) => handleFieldChange("client", e.target.value)} /> : project.client}</td>
                  <td>{isEditing ? <input className="table-input" value={editValues.product} onChange={(e) => handleFieldChange("product", e.target.value)} /> : project.product}</td>
                  <td>{isEditing ? <input className="table-input" value={editValues.jobType} onChange={(e) => handleFieldChange("jobType", e.target.value)} /> : project.jobType}</td>
                  <td>{isEditing ? <input className="table-input" type="number" value={editValues.hours} onChange={(e) => handleFieldChange("hours", e.target.value)} /> : project.hours || "-"}</td>
                  <td>{isEditing ? <input className="table-input" value={editValues.web} onChange={(e) => handleFieldChange("web", e.target.value)} /> : project.web}</td>
                  <td>
                    {isEditing ? (
                      <select className="table-input" value={editValues.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
                        <option>Delivered</option>
                        <option>In Progress</option>
                        <option>Pending Approval</option>
                        <option>Blocked</option>
                      </select>
                    ) : (
                      project.status
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select className="table-input" value={editValues.timesheet} onChange={(e) => handleFieldChange("timesheet", e.target.value)}>
                        <option>Delivered</option>
                        <option>-</option>
                        <option>Pending</option>
                        <option>Not Submitted</option>
                      </select>
                    ) : (
                      project.timesheet
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select className="table-input" value={editValues.priority} onChange={(e) => handleFieldChange("priority", e.target.value)}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    ) : (
                      <span className={`priority-pill priority-${(project.priority || "Medium").toLowerCase()}`}>
                        {project.priority || "Medium"}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input className="table-input" type="date" value={editValues.deadline || ""} onChange={(e) => handleFieldChange("deadline", e.target.value)} />
                    ) : (
                      project.deadline ? new Date(project.deadline).toLocaleDateString() : "-"
                    )}
                  </td>
                  {showAssignedTo && <td>{project.user?.name || "-"}</td>}
                  {showAssignedTo && <td>{project.assignedBy?.name || "-"}</td>}
                  {canManageProjects && (
                    <td className="table-actions">
                      {isEditing ? (
                        <>
                          <button onClick={saveEdit} className="btn btn-small btn-primary">Save</button>
                          <button onClick={cancelEdit} className="btn btn-small btn-ghost">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(project)} className="btn btn-small btn-secondary">Edit</button>
                          <button onClick={() => dispatch(deleteProject(project._id))} className="btn btn-small btn-danger">Delete</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

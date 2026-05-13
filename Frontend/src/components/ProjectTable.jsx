import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProject, updateProject } from "../features/projects/projectSlice";
import { useAppContext } from "../context/AppContext";

export default function ProjectTable() {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const { filteredProjects } = useAppContext();
  const user = useSelector((state) => state.auth.user);

  const showAssignedTo = user?.role === "manager";

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
            {showAssignedTo && <th>Assigned To</th>}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan={showAssignedTo ? "11" : "10"} style={{ textAlign: "center" }}>
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
                  {showAssignedTo && <td>{project.user?.name || "-"}</td>}
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { assignEmployeeManager } from "../features/projects/projectSlice";

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { employees, managers } = useSelector((state) => state.projects);
  const assignableEmployees = employees.filter((employee) => employee.role === "employee");

  const handleManagerChange = (employeeId, managerId) => {
    dispatch(assignEmployeeManager({ employeeId, managerId }));
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="daily-kicker">Admin</span>
          <h2>Team Assignment</h2>
        </div>
        <p>Assign employees to managers so each manager only sees their own team.</p>
      </div>

      <div className="table-container admin-table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Current Manager</th>
              <th>Assign Manager</th>
            </tr>
          </thead>
          <tbody>
            {assignableEmployees.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No employees found
                </td>
              </tr>
            ) : (
              assignableEmployees.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.manager?.name || "-"}</td>
                    <td>
                      <select
                        className="table-input"
                        value={employee.manager?._id || ""}
                        onChange={(event) =>
                          handleManagerChange(employee._id, event.target.value)
                        }
                      >
                        <option value="">Unassigned</option>
                        {managers.map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.name} ({manager.email})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

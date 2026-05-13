import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "../context/AppContext";
import { createProject } from "../features/projects/projectSlice";

export default function Modal() {
  const dispatch = useDispatch();
  const { modalOpen, closeModal, modalValues, setModalValues } = useAppContext();
  const user = useSelector((state) => state.auth.user);
  const employees = useSelector((state) => state.projects.employees);

  if (!modalOpen) return null;

  const isManager = user?.role === "manager";

  const handleSave = async () => {
    if (!modalValues.name || !modalValues.client || !modalValues.product) {
      alert("Please fill required fields");
      return;
    }

    if (isManager && !modalValues.assigneeId) {
      alert("Please select an employee");
      return;
    }

    try {
      await dispatch(
        createProject({
          ...modalValues,
          assigneeId: isManager ? modalValues.assigneeId : undefined,
          status: modalValues.status || "Delivered",
          timesheet: modalValues.timesheet || "Delivered",
          hours: Number(modalValues.hours) || 0,
        })
      );

      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="modal" role="dialog" style={{ display: "flex" }} onClick={handleOutsideClick}>
      <div className="panel" onClick={(event) => event.stopPropagation()}>
        <h3>{modalValues.name ? "Edit Project" : "Add Project"}</h3>

        <div className="grid">
          {isManager && (
            <select
              value={modalValues.assigneeId || ""}
              onChange={(e) =>
                setModalValues((prev) => ({
                  ...prev,
                  assigneeId: e.target.value,
                }))
              }
            >
              <option value="" disabled>
                Select employee
              </option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>
          )}

          <input
            placeholder="Project name *"
            value={modalValues.name}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                name: e.target.value.replace(/[0-9]/g, ""),
              }))
            }
          />

          <input
            placeholder="Client *"
            value={modalValues.client}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                client: e.target.value.replace(/[0-9]/g, ""),
              }))
            }
          />

          <input
            placeholder="Product line *"
            value={modalValues.product}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                product: e.target.value.replace(/[0-9]/g, ""),
              }))
            }
          />

          <select
            value={modalValues.jobType}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                jobType: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select job type
            </option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Graphics">Graphics</option>
          </select>

          <input
            type="number"
            placeholder="Total hours"
            value={modalValues.hours}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                hours: e.target.value,
              }))
            }
          />

          <input
            placeholder="Web Version"
            value={modalValues.web}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                web: e.target.value,
              }))
            }
          />

          <select
            value={modalValues.status}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select project progress
            </option>
            <option value="Delivered">Delivered</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select
            value={modalValues.timesheet}
            onChange={(e) =>
              setModalValues((prev) => ({
                ...prev,
                timesheet: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select timesheet status
            </option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Not Submitted">Not Submitted</option>
          </select>
        </div>

        <div className="actions">
          <button className="ribbon-btn" onClick={closeModal}>
            Cancel
          </button>

          <button className="ribbon-btn active" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

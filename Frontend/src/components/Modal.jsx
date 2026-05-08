import { useDispatch } from "react-redux";
import { useAppContext } from "../context/AppContext";
import { createProject } from "../features/projects/projectSlice";

export default function Modal() {
  // ✅ Hooks ALWAYS top pe
  const dispatch = useDispatch();
  const { modalOpen, closeModal, modalValues, setModalValues } = useAppContext();

  // ✅ Early return AFTER hooks
  if (!modalOpen) return null;

  const handleSave = async () => {
    // 🔥 validation
    if (!modalValues.name || !modalValues.client || !modalValues.product) {
      alert("Please fill required fields");
      return;
    }

    try {
      await dispatch(
        createProject({
          ...modalValues,
          status: modalValues.status || "Delivered",
          timesheet: modalValues.timesheet || "Delivered",
          hours: Number(modalValues.hours) || 0, // ✅ fix
        })
      );

      closeModal(); // ✅ close after success
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
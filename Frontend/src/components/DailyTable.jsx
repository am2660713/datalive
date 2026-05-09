import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useSelector } from "react-redux";

const emptyForm = {
  date: "",
  day: "",
  client: "",
  project: "",
  jobType: "",
  b: "",
  nb: "",
};

export default function DailyTable() {
  const {
    activeMonth,
    setMonth,
    daily,
    addDailyEntry,
    updateDailyEntry,
    deleteDailyEntry,
  } = useAppContext();

  const { projects } = useSelector((state) => state.projects);

  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(-1);
  const [error, setError] = useState("");

  const rows = daily[activeMonth] || [];

  const monthBillable = rows.reduce((sum, row) => sum + (Number(row.b) || 0), 0);
  const monthNonBillable = rows.reduce((sum, row) => sum + (Number(row.nb) || 0), 0);
  const monthTotal = monthBillable + monthNonBillable;

  const selectedProject = projects.find((item) => item.name === form.project);
  const projectTotalHours = Number(selectedProject?.hours) || 0;

  const projectCurrentUsage = Object.entries(daily).reduce((sum, [month, monthRows]) => {
    return (
      sum +
      monthRows.reduce((rowSum, row, index) => {
        if (row.project !== form.project) return rowSum;
        if (editIndex >= 0 && month === activeMonth && index === editIndex) return rowSum;
        return rowSum + (Number(row.b) || 0);
      }, 0)
    );
  }, 0);

  const remainingProjectHours =
    projectTotalHours > 0 ? projectTotalHours - projectCurrentUsage : null;

  const resetForm = () => {
    setForm(emptyForm);
    setEditIndex(-1);
    setError("");
  };

  const updateProjectSelection = (projectName) => {
    const selected = projects.find(
      (item) => item.name?.toLowerCase() === projectName.toLowerCase()
    );

    setForm((prev) => ({
      ...prev,
      project: projectName,
      client: selected ? selected.client : "",
      jobType: selected ? selected.jobType : "",
    }));
  };

  const handleSubmit = async () => {
    if (!form.date || !form.project) {
      setError("Please choose a date and project before saving.");
      return;
    }

    const newBillableHours = Number(form.b) || 0;

    if (
      remainingProjectHours !== null &&
      newBillableHours > Number(remainingProjectHours.toFixed(2))
    ) {
      setError(
        `This project has only ${Math.max(0, remainingProjectHours).toFixed(1)}h billable remaining overall. This entry requires ${newBillableHours.toFixed(1)}h billable.`
      );
      return;
    }

    const entry = {
      ...form,
      day:
        form.day.trim() ||
        new Date(form.date).toLocaleString("en-US", {
          weekday: "long",
        }),
    };

    const result =
      editIndex >= 0
        ? await updateDailyEntry(activeMonth, editIndex, entry)
        : await addDailyEntry(entry);

    if (!result?.success) {
      setError(result?.message || "Unable to save entry.");
      return;
    }

    resetForm();
  };

  const handleEdit = (index) => {
    const row = rows[index];
    if (!row) return;

    setForm({
      date: row.date,
      day: row.day,
      client: row.client,
      project: row.project,
      jobType: row.jobType,
      b: row.b,
      nb: row.nb,
    });

    setEditIndex(index);
    setError("");
  };

  const handleDelete = (index) => {
    deleteDailyEntry(activeMonth, index);

    if (editIndex === index) {
      resetForm();
    }
  };

  return (
    <div className="daily-shell">
      <div className="daily-hero">
        <div>
          <span className="daily-kicker">Daily Status Report</span>
          <h2>{activeMonth || "Select a month"}</h2>
          <p>
            Track daily billable and non-billable work while keeping project hour limits visible.
          </p>
        </div>

        <div className="daily-metrics">
          <div className="daily-metric">
            <span>{rows.length}</span>
            <small>Entries</small>
          </div>
          <div className="daily-metric">
            <span>{monthBillable.toFixed(1)}h</span>
            <small>Billable</small>
          </div>
          <div className="daily-metric">
            <span>{monthTotal.toFixed(1)}h</span>
            <small>Total</small>
          </div>
        </div>
      </div>

      <div className="month-filter" aria-label="Month filter">
        {Object.keys(daily).map((month) => (
          <button
            key={month}
            type="button"
            className={`month-btn ${activeMonth === month ? "active" : ""}`}
            onClick={() => setMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>

      {!activeMonth ? (
        <div className="daily-empty-state">
          <div className="daily-empty-card">
            <strong>Select a month first</strong>
            <p>Choose a month above to view and add daily entries for that period.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="daily-form-card">
            <div className="daily-form-heading">
              <div>
                <span className="daily-kicker">{editIndex >= 0 ? "Editing entry" : "New entry"}</span>
                <h3>{editIndex >= 0 ? "Update daily work" : "Add daily work"}</h3>
              </div>

              {projectTotalHours > 0 && (
                <div className="daily-hint">
                  <span>Project limit: {projectTotalHours}h</span>
                  <span>Remaining: {Math.max(0, remainingProjectHours).toFixed(1)}h</span>
                </div>
              )}
            </div>

            <div className="daily-entry-row">
              <label>
                <span>Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>

              <label>
                <span>Day</span>
                <input
                  type="text"
                  placeholder="Auto-filled if blank"
                  value={form.day}
                  onChange={(e) => setForm((prev) => ({ ...prev, day: e.target.value }))}
                />
              </label>

              <label className="daily-field-wide">
                <span>Project</span>
                <select value={form.project} onChange={(e) => updateProjectSelection(e.target.value)}>
                  <option value="">Select project...</option>
                  {projects.length === 0 ? (
                    <option disabled>Loading...</option>
                  ) : (
                    projects.map((project) => (
                      <option key={project._id} value={project.name}>
                        {project.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              <label>
                <span>Client</span>
                <input
                  placeholder="Client"
                  value={form.client}
                  onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
                />
              </label>

              <label>
                <span>Job Type</span>
                <input
                  placeholder="Job type"
                  value={form.jobType}
                  onChange={(e) => setForm((prev) => ({ ...prev, jobType: e.target.value }))}
                />
              </label>

              <label>
                <span>Billable</span>
                <input
                  type="number"
                  placeholder="0.0"
                  value={form.b}
                  onChange={(e) => {
                    const val = e.target.value;
                    const billable = parseFloat(val);

                    if (!isNaN(billable)) {
                      const nb = Math.max(0, 8.5 - billable).toFixed(1);
                      setForm((prev) => ({ ...prev, b: val, nb }));
                    } else {
                      setForm((prev) => ({ ...prev, b: val }));
                    }
                  }}
                />
              </label>

              <label>
                <span>Non-Billable</span>
                <input
                  type="number"
                  placeholder="0.0"
                  value={form.nb}
                  onChange={(e) => setForm((prev) => ({ ...prev, nb: e.target.value }))}
                />
              </label>

              <div className="daily-action-group daily-form-actions">
                <button type="button" onClick={handleSubmit} className="btn btn-small btn-primary">
                  {editIndex >= 0 ? "Update" : "Add"}
                </button>

                {editIndex >= 0 && (
                  <button type="button" onClick={resetForm} className="btn btn-small btn-ghost">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {error && <p className="daily-error">{error}</p>}
          </div>

          <div className="daily-table-card">
            <div className="daily-table-title">
              <div>
                <span className="daily-kicker">Entries</span>
                <h3>{activeMonth} work log</h3>
              </div>
              <span>{monthNonBillable.toFixed(1)}h non-billable</span>
            </div>

            <div className="daily-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Job Type</th>
                    <th>Billable</th>
                    <th>Non-Billable</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="daily-table-empty">
                        No daily entries yet for {activeMonth}.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => {
                      const total = (Number(row.b) || 0) + (Number(row.nb) || 0);

                      return (
                        <tr key={`${row.date}-${row.project}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{row.date}</td>
                          <td>{row.day}</td>
                          <td>{row.client}</td>
                          <td>{row.project}</td>
                          <td>{row.jobType}</td>
                          <td>
                            <span className="hour-pill billable">{row.b || 0}h</span>
                          </td>
                          <td>
                            <span className="hour-pill nonbillable">{row.nb || 0}h</span>
                          </td>
                          <td>
                            <strong>{total.toFixed(1)}h</strong>
                          </td>
                          <td>
                            <div className="daily-action-group">
                              <button
                                type="button"
                                className="btn btn-small btn-secondary"
                                onClick={() => handleEdit(index)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-small btn-danger"
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

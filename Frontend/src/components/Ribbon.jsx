import { useSelector } from "react-redux";
import { useAppContext } from "../context/AppContext";

export default function Ribbon() {
  const {
    exportCSV,
    toggleFilters,
    toggleCharts,
    filtersVisible,
    searchQuery,
    setSearchQuery,
    clearFilters,
    summary,
    openAddProject,
  } = useAppContext();
  const user = useSelector((state) => state.auth.user);
  const canCreateProjects = ["admin", "manager"].includes(user?.role);

  return (
    <div className="ribbon">
      <button className="ribbon-btn" onClick={exportCSV}>
        Export CSV
      </button>

      <div className="ribbon-sep"></div>

      {canCreateProjects && (
        <>
          <button className="ribbon-btn active" onClick={openAddProject}>
            Add Project
          </button>

          <div className="ribbon-sep"></div>
        </>
      )}

      <button
        className={`ribbon-btn ${filtersVisible ? "active" : ""}`}
        onClick={toggleFilters}
      >
        Filters
      </button>

      <button className="ribbon-btn" onClick={clearFilters}>
        Clear Filters
      </button>

      <div className="ribbon-sep"></div>

      <button className="ribbon-btn" onClick={toggleCharts}>
        Charts
      </button>

      <div className="ribbon-sep"></div>

      <input
        className="search-box"
        type="text"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="ribbon-sep"></div>

      <span className="ribbon-count">
        Rows: <b>{summary.total || 0}</b>
      </span>
    </div>
  );
}

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Ribbon from "../components/Ribbon";
import SummaryCards from "../components/SummaryCards";
import ProjectTable from "../components/ProjectTable";
import DailyTable from "../components/DailyTable";
import YearlyTable from "../components/YearlyTable";
import Modal from "../components/Modal";
import ProjectCharts from "../components/ProjectCharts";
import AdminPanel from "../components/AdminPanel";
import { useAppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees, getManagers, getProjects } from "../features/projects/projectSlice";
import { useEffect } from "react";

export default function Dashboard() {
  const { activeSheet, chartsVisible, summary, authUser } = useAppContext();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (token) {
      dispatch(getProjects());
      if (["admin", "manager"].includes(user?.role)) {
        dispatch(getEmployees());
      }
      if (user?.role === "admin") {
        dispatch(getManagers());
      }
    }
  }, [dispatch, token, user?.role]);

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="workspace-main">
        <Topbar />
        <Ribbon />

        <div className="workspace-content">
          <div className={`page ${activeSheet === "projects" ? "active" : ""}`} id="page-projects">
            <SummaryCards />
            <ProjectTable />
            {chartsVisible && <ProjectCharts />}
          </div>

          <div className={`page ${activeSheet === "daily" ? "active" : ""}`} id="page-daily">
            <DailyTable />
          </div>

          <div className={`page ${activeSheet === "yearly" ? "active" : ""}`} id="page-yearly">
            <YearlyTable />
          </div>

          <div className={`page ${activeSheet === "admin" ? "active" : ""}`} id="page-admin">
            <AdminPanel />
          </div>
        </div>

        <Modal />

        <div className="status-bar">
          <span id="sbSheet">
            Sheet: {activeSheet === "projects" ? "Project Tracking" : activeSheet === "daily" ? "Daily Status Report" : activeSheet === "admin" ? "Admin" : "Yearly Summary"}
          </span>
          <span id="sbRows">Rows: {summary.total}</span>
          <span style={{ flex: 1 }}></span>
          <span>{authUser?.name || "Employee Project Data"}</span>
        </div>
      </div>
    </div>
  );
}

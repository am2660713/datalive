import { useEffect, useMemo, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useAppContext } from "../context/AppContext";

Chart.register(...registerables);

export default function ProjectCharts() {
  const clientsRef = useRef(null);
  const statusRef = useRef(null);
  const { filteredProjects } = useAppContext();

  const clientData = useMemo(() => {
    const totals = filteredProjects.reduce((acc, project) => {
      const client = project.client || "Unknown";
      acc[client] = (acc[client] || 0) + (Number(project.hours) || 0);
      return acc;
    }, {});

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [filteredProjects]);

  const statusData = useMemo(() => {
    const totals = filteredProjects.reduce((acc, project) => {
      const status = project.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(totals);
  }, [filteredProjects]);

  useEffect(() => {
    if (!clientsRef.current || !statusRef.current) return undefined;

    if (clientsRef.current.chart) clientsRef.current.chart.destroy();
    if (statusRef.current.chart) statusRef.current.chart.destroy();

    clientsRef.current.chart = new Chart(clientsRef.current, {
      type: "bar",
      data: {
        labels: clientData.map(([client]) => client),
        datasets: [
          {
            label: "Hours",
            data: clientData.map(([, hours]) => hours),
            backgroundColor: "#3f7df3",
            borderRadius: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    statusRef.current.chart = new Chart(statusRef.current, {
      type: "doughnut",
      data: {
        labels: statusData.map(([status]) => status),
        datasets: [
          {
            data: statusData.map(([, count]) => count),
            backgroundColor: ["#33a66f", "#3f7df3", "#f3b33f", "#e85d75", "#7b61ff"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => {
      if (clientsRef.current?.chart) clientsRef.current.chart.destroy();
      if (statusRef.current?.chart) statusRef.current.chart.destroy();
    };
  }, [clientData, statusData]);

  return (
    <div className="chart-area">
      <div className="chart-box">
        <div className="chart-title">Hours by Client</div>
        <div className="chart-wrap">
          {filteredProjects.length ? (
            <canvas ref={clientsRef} role="img" aria-label="Bar chart of total hours by client"></canvas>
          ) : (
            <div className="chart-empty">No project data to chart</div>
          )}
        </div>
      </div>

      <div className="chart-box">
        <div className="chart-title">Project Status Distribution</div>
        <div className="chart-wrap">
          {filteredProjects.length ? (
            <canvas ref={statusRef} role="img" aria-label="Doughnut chart of project statuses"></canvas>
          ) : (
            <div className="chart-empty">No project data to chart</div>
          )}
        </div>
      </div>
    </div>
  );
}

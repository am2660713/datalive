import { useAppContext } from "../context/AppContext";
import { useEffect, useRef, useMemo } from "react";
import { Chart, registerables } from "chart.js";

export default function YearlyTable() {
  const { daily = {}, target, setTarget } = useAppContext();

  const yearlyRef = useRef(null);
  const pieRef = useRef(null);

  Chart.register(...registerables);

  // ✅ MONTHLY CALCULATION
  const monthly = useMemo(() => {
    return Object.keys(daily).map((month) => {
      const rows = daily[month] || [];

      const billable = rows.reduce((sum, r) => sum + (Number(r.b) || 0), 0);
      const nonBillable = rows.reduce((sum, r) => sum + (Number(r.nb) || 0), 0);
      const total = billable + nonBillable;

      return { month, total, billable, nonBillable };
    });
  }, [daily]);

  // ✅ TOTALS
  const totalBilling = monthly.reduce((sum, m) => sum + m.billable, 0);
  const totalHours = monthly.reduce((sum, m) => sum + m.total, 0);
  const totalNonBillable = monthly.reduce((sum, m) => sum + m.nonBillable, 0);

  const efficiency =
    target?.yearlyTarget > 0
      ? ((totalBilling / target.yearlyTarget) * 100).toFixed(1)
      : 0;

  // ================= CHART =================
  useEffect(() => {
    if (!monthly.length) return;

    if (yearlyRef.current?.chart) yearlyRef.current.chart.destroy();
    if (pieRef.current?.chart) pieRef.current.chart.destroy();

    const labels = monthly.map((m) => m.month.slice(0, 3));
    const yearlyCtx = yearlyRef.current.getContext("2d");
    const pieCtx = pieRef.current.getContext("2d");

    const billableGradient = yearlyCtx.createLinearGradient(0, 0, 0, 320);
    billableGradient.addColorStop(0, "#7ee6a1");
    billableGradient.addColorStop(1, "#2f7fff");

    const nonBillableGradient = yearlyCtx.createLinearGradient(0, 0, 0, 320);
    nonBillableGradient.addColorStop(0, "#c4ddff");
    nonBillableGradient.addColorStop(1, "#4c8bff");

    // BAR CHART
    yearlyRef.current.chart = new Chart(yearlyRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Billable",
            data: monthly.map((m) => m.billable),
            backgroundColor: billableGradient,
            borderRadius: 10,
            borderSkipped: false,
            hoverBackgroundColor: "rgba(50, 110, 255, 0.9)",
          },
          {
            label: "Non-Billable",
            data: monthly.map((m) => m.nonBillable),
            backgroundColor: nonBillableGradient,
            borderRadius: 10,
            borderSkipped: false,
            hoverBackgroundColor: "rgba(112, 173, 248, 0.95)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#1f3b71",
              boxWidth: 12,
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: "rgba(30, 45, 88, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#f6f7ff",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#2e447c" },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(47, 117, 255, 0.12)",
              borderDash: [4, 4],
            },
            ticks: {
              color: "#2e447c",
              precision: 0,
            },
          },
        },
      },
    });

    // PIE CHART
    const pieGradient = pieCtx.createLinearGradient(0, 0, 200, 0);
    pieGradient.addColorStop(0, "#7ee6a1");
    pieGradient.addColorStop(1, "#4c8bff");

    pieRef.current.chart = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels: ["Billable", "Non-Billable"],
        datasets: [
          {
            data: [totalBilling, totalNonBillable],
            backgroundColor: ["#7ee6a1", "#9dc3e6"],
            hoverOffset: 8,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#1f3b71",
              boxWidth: 12,
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: "rgba(30, 45, 88, 0.95)",
            titleColor: "#ffffff",
            bodyColor: "#f6f7ff",
          },
        },
      },
    });
  }, [monthly, totalBilling, totalNonBillable]);

  return (
    <>
      {/* 🔹 TOP BAR */}
      <div className="summary-bar">

        {/* YEARLY TARGET */}
        <div className="stat-card">
          <div className="stat-val">
            <input
              type="number"
              value={target?.yearlyTarget || 0}
              onChange={(e) =>
                setTarget((prev) => ({
                  ...prev,
                  yearlyTarget: Number(e.target.value),
                }))
              }
              style={{ width: 80 }}
            />
          </div>
          <div className="stat-lbl">Yearly Target</div>
        </div>

        {/* TOTAL BILLING */}
        <div className="stat-card">
          <div className="stat-val">{totalBilling.toFixed(1)}</div>
          <div className="stat-lbl">Total Billing</div>
        </div>

        {/* EFFICIENCY */}
        <div className="stat-card">
          <div className="stat-val">{efficiency}%</div>
          <div className="stat-lbl">Efficiency</div>
        </div>

      </div>

      {/* 🔹 CHARTS */}
      <div className="yearly-chart-grid">
        <div className="chart-card chart-card-large">
          <div className="chart-card-title">Monthly Billable vs Non-Billable</div>
          <div className="chart-canvas-wrapper">
            <canvas ref={yearlyRef}></canvas>
          </div>
        </div>

        <div className="chart-card chart-card-small">
          <div className="chart-card-title">Billing Mix</div>
          <div className="chart-canvas-wrapper chart-canvas-small">
            <canvas ref={pieRef}></canvas>
          </div>
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="summary-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total</th>
              <th>Billable</th>
              <th>Non-Billable</th>
              <th>%</th>
              <th>Target</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {monthly.map((m) => {
              const pct = m.total > 0 ? ((m.billable / m.total) * 100).toFixed(1) : 0;

              const hasManualTargets =
                target?.monthlyTargets &&
                Object.keys(target.monthlyTargets).length > 0;

              const monthTarget = hasManualTargets
                ? target?.monthlyTargets?.[m.month] || 0
                : target?.yearlyTarget
                ? target.yearlyTarget / 12
                : 0;

              const progress = monthTarget > 0 ? ((m.billable / monthTarget) * 100).toFixed(1) : 0;

              return (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td>{m.total.toFixed(1)}</td>
                  <td className="text-positive">{m.billable.toFixed(1)}</td>
                  <td className="text-warning">{m.nonBillable.toFixed(1)}</td>
                  <td>{pct}%</td>

                  {/* TARGET INPUT */}
                  <td>
                    <input
                      type="number"
                      value={Math.round(monthTarget)}
                      onChange={(e) =>
                        setTarget((prev) => ({
                          ...prev,
                          monthlyTargets: {
                            ...prev.monthlyTargets,
                            [m.month]: Number(e.target.value),
                          },
                        }))
                      }
                      className="summary-input"
                    />
                  </td>

                  {/* PROGRESS BAR */}
                  <td className="progress-cell">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className="progress-label">{progress}%</span>
                  </td>
                </tr>
              );
            })}

            {/* TOTAL */}
            <tr className="summary-total-row">
              <td>TOTAL</td>
              <td>{totalHours.toFixed(1)}</td>
              <td>{totalBilling.toFixed(1)}</td>
              <td>{totalNonBillable.toFixed(1)}</td>
              <td>{efficiency}%</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
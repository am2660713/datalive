/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { projectAPI, dailyAPI } from "../api";
import { targetAPI } from "../api";
const AUTH_USER_KEY = "project-dashboard-auth-user";
const AUTH_ENABLED_KEY = "project-dashboard-authenticated";

const defaultProjects = [];

const initialDaily = {
  January: [],
  February: [],
  March: [],
  April: [],
  May: [],
  June: [],
  July: [],
  August: [],
  September: [],
  October: [],
  November: [],
  December: [],
};

const defaultModalValues = {
  name: "",
  client: "",
  product: "",
  jobType: "",
  hours: "",
  web: "",
  status: "",
  timesheet: "",
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [target, setTarget] = useState({
    yearlyTarget: 1000,
    monthlyTargets: {},
  });
  const [authUser, setAuthUser] = useState(null);
  const [projects, setProjects] = useState(defaultProjects);
  const [daily, setDaily] = useState(initialDaily);
  // const [monthly, setMonthly] = useState(initialMonthly);
  const [activeSheet, setActiveSheet] = useState("projects");
  const [activeMonth, setActiveMonth] = useState("");
  const [chartsVisible, setChartsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [modalValues, setModalValues] = useState(defaultModalValues);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
  const [sortDir, setSortDir] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const normalizeId = (doc) => ({
    ...doc,
    _id: doc._id?.toString ? doc._id.toString() : doc._id,
  });

  const filteredProjects = useMemo(() => {
    let results = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((project) =>
        project.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q) ||
        project.product.toLowerCase().includes(q)
      );
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (!value.trim()) return;
      const idx = parseInt(key.replace("f", ""), 10);
      const filterFields = ["sr", "name", "client", "product", "jobType", "web", "status", "timesheet"];
      const field = filterFields[idx];
      if (!field) return;
      results = results.filter((p) => String(p[field]).toLowerCase().includes(value.toLowerCase()));
    });
    const sortEntries = Object.entries(sortDir);
    if (sortEntries.length > 0) {
      const [fieldIndex, direction] = sortEntries[sortEntries.length - 1];
      const fields = ["sr", "name", "client", "product", "jobType", "hours", "web", "status", "timesheet"];
      const fieldName = fields[Number(fieldIndex)];
      if (fieldName) {
        results = [...results].sort((a, b) => {
          const aVal = a[fieldName];
          const bVal = b[fieldName];
          if (typeof aVal === "number" && typeof bVal === "number") {
            return direction === "asc" ? aVal - bVal : bVal - aVal;
          }
          const aStr = String(aVal || "").toLowerCase();
          const bStr = String(bVal || "").toLowerCase();
          return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });
      }
    }
    return results;
  }, [projects, searchQuery, filters, sortDir]);

// Load user and data from MongoDB via API
  useEffect(() => {
    const loadUser = async () => {
    
      const rawUser = localStorage.getItem("user");
      // const isAuthenticated = localStorage.getItem(AUTH_ENABLED_KEY) === "true";
      if (!rawUser ) {
        setAuthUser(null);
        setProjects(defaultProjects);
        setDaily(initialDaily);
        setIsLoading(false);
        return;
      }
      try {
        const user = JSON.parse(rawUser);
        setAuthUser(user);
        const userEmail = user.email;

        const [projectsResult, dailyResult, targetResult] = await Promise.allSettled([
          projectAPI.getAll(userEmail),
          dailyAPI.getAll(userEmail),
          targetAPI.get(userEmail),
        ]);

        const storedProjects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
        const storedDaily = dailyResult.status === "fulfilled" ? dailyResult.value : [];
        const storedTarget = targetResult.status === "fulfilled" ? targetResult.value : null;

        [projectsResult, dailyResult, targetResult].forEach((result) => {
          if (result.status === "rejected") {
            console.warn("Error loading dashboard data:", result.reason);
          }
        });

        if (storedTarget) {
          setTarget({
            yearlyTarget: storedTarget.yearlyTarget || 1000,
            monthlyTargets: storedTarget.monthlyTargets || {},
          });
        }
        if (storedProjects.length) {
          const projs = storedProjects.map((p) => ({
            ...normalizeId(p),
            sr: p.sr,
            name: p.name,
            client: p.client,
            product: p.product,
            jobType: p.jobType,
            hours: p.hours,
            web: p.web,
            status: p.status,
            timesheet: p.timesheet,
          }));
          setProjects(projs);
        }

        if (storedDaily.length) {
          const dailyObj = { ...initialDaily };
          storedDaily.forEach((entry) => {
            const monthKey = entry.month ? entry.month : entry.date ? new Date(entry.date).toLocaleString("en-US", { month: "long" }) : null;
            if (monthKey && dailyObj[monthKey]) {
              dailyObj[monthKey].push({
                ...normalizeId(entry),
                date: entry.date,
                day: entry.day,
                client: entry.client,
                project: entry.project,
                jobType: entry.jobType,
                b: entry.b,
                nb: entry.nb,
              });
            }
          });
          setDaily(dailyObj);
        }

        // if (storedMonthly.length) {
        //   // setMonthly(storedMonthly.map((m) => normalizeId(m)));
        // }
      } catch (error) {
        console.warn("Error loading from MongoDB:", error);
      }
      setIsLoading(false);
    };

    loadUser();
    const handleAuthChange = () => loadUser();
    window.addEventListener("app-auth-updated", handleAuthChange);
    return () => window.removeEventListener("app-auth-updated", handleAuthChange);
  }, []);

  // useEffect(() => {
  //   if (!authUser || isLoading) return;
  //   const saveMonthlyData = async () => {
  //     try {
  //       await monthlyAPI.save(monthly, authUser.email);
  //     } catch (error) {
  //       console.error("Error saving monthly summary to MongoDB:", error);
  //     }
  //   };
  //   saveMonthlyData();
  // }, [monthly, authUser, isLoading]);
  useEffect(() => {
    if (!authUser?.email || isLoading) return;
  
    const timeout = setTimeout(() => {
      targetAPI.save({
        userEmail: authUser.email,
        yearlyTarget: target.yearlyTarget,
        monthlyTargets: target.monthlyTargets,
      });
    }, 500); // delay
  
    return () => clearTimeout(timeout);
  }, [authUser?.email, isLoading, target]);
  function exportCSV() {
    const headers = ["Sr", "Project Name", "Client", "Product Line", "Job Type", "Hours", "WEB Version", "Status", "Timesheet"];
    const rows = filteredProjects.map((project) => [
      project.sr,
      project.name,
      project.client,
      project.product,
      project.jobType,
      project.hours,
      project.web,
      project.status,
      project.timesheet,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "projects.csv";
    link.click();
  }

  function clearFilters() {
    setSearchQuery("");
    setFilters({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
  }

function sortTable(field) {
    const alwaysAscFields = ["client", "product"];
    const direction = alwaysAscFields.includes(field) ? "asc" : (sortDir[field] === "asc" ? "desc" : "asc");
    setSortDir((prev) => ({ ...prev, [field]: direction }));
  }

  async function deleteProject(sr) {
    const project = projects.find((p) => p.sr === sr);
    if (project?._id) {
      try {
        await projectAPI.delete(project._id);
      } catch (error) {
        console.error("Error deleting project from MongoDB:", error);
      }
    }
    setProjects((prev) => prev.filter((p) => p.sr !== sr));
  }

  function openAddProject() {
    setEditingIndex(-1);
    setModalValues(defaultModalValues);
    setModalOpen(true);
  }

  function editProject(sr) {
    const project = projects.find((p) => p.sr === sr);
    if (!project) return;
    setEditingIndex(sr);
    setModalValues(project);
    setModalOpen(true);
  }

  async function saveProject() {
    const { name, client, product, jobType, hours, web, status, timesheet } = modalValues;
    if (!name.trim() || !client.trim() || !product.trim()) {
      alert("Project name, client, and product line are required.");
      return;
    }

    const projectData = {
      sr: editingIndex >= 0 ? editingIndex : projects.length > 0 ? Math.max(...projects.map((p) => p.sr)) + 1 : 1,
      name: name.trim(),
      client: client.trim(),
      product: product.trim(),
      jobType: jobType.trim(),
      hours: Number(hours) || 0,
      web: web.trim(),
      status,
      timesheet,
    };

    if (editingIndex >= 0) {
      const existing = projects.find((p) => p.sr === editingIndex);
      if (existing) {
        try {
          if (existing._id) {
            await projectAPI.update(existing._id, projectData);
          }
        } catch (error) {
          console.error("Error updating project in MongoDB:", error);
        }
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.sr === editingIndex
            ? { ...p, ...projectData }
            : p
        )
      );
    } else {
      try {
        const saved = await projectAPI.add(projectData, authUser.email);
        setProjects((prev) => [...prev, saved]);
      } catch (error) {
        console.error("Error adding project to MongoDB:", error);
        setProjects((prev) => [...prev, projectData]);
      }
    }

    closeModal();
  }

  function closeModal() {
    setModalOpen(false);
    setEditingIndex(-1);
    setModalValues(defaultModalValues);
  }

  function calculateProjectUsage(projectName, exclude = null, month = null) {
    const projectKey = projectName.trim();
    const monthsToCheck = month ? [month] : Object.keys(daily);

    return monthsToCheck.reduce((sum, m) => {
      const rows = daily[m] || [];
      return (
        sum +
        rows.reduce((rowSum, row, index) => {
          if (row.project !== projectKey) return rowSum;

          // Exclude the currently-edited row so remaining-hours is computed correctly.
          // `exclude.month` should be the month KEY used in `daily` (e.g., "January").
          // `exclude.index` is the row index within that month array.
          if (exclude && exclude.month === m && exclude.index === index) return rowSum;

          // Only count billable hours against project allocation.
          return rowSum + (Number(row.b) || 0);
        }, 0)
      );
    }, 0);
  }



  function getProjectTotalHours(projectName) {
    const project = projects.find((item) => item.name === projectName.trim());
    return Number(project?.hours) || 0;
  }

  function validateDailyEntry(entry, exclude = null) {
    const projectName = entry.project.trim();
    if (!projectName) return { valid: true };

    const totalHours = getProjectTotalHours(projectName);
    if (!totalHours) return { valid: true };

    const newEntryBillableHours = Number(entry.b) || 0;

    // Calculate usage across ALL months to enforce the project's overall remaining hours
    const currentUsage = calculateProjectUsage(projectName, exclude);
    const remaining = totalHours - currentUsage;

    if (newEntryBillableHours > remaining) {
      return {
        valid: false,
        message: `Project '${projectName}' only has ${Math.max(0, remaining).toFixed(1)}h remaining billable. This entry requires ${newEntryBillableHours.toFixed(1)}h billable.`,
      };
    }

    return { valid: true };
  }

  async function addDailyEntry(entry) {
    const date = entry.date.trim();
    if (!date) return { success: false, message: "Please choose a valid date." };
    const validation = validateDailyEntry(entry);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }
    const parsed = new Date(date);
    const monthName = parsed.toLocaleString("en-US", { month: "long" }) || activeMonth;
    const dayName = entry.day.trim() || parsed.toLocaleString("en-US", { weekday: "long" });
    const newEntry = {
      date,
      month: monthName,
      day: dayName,
      client: entry.client.trim(),
      project: entry.project.trim(),
      jobType: entry.jobType.trim() || "Work",
      b: Number(entry.b) || 0,
      nb: Number(entry.nb) || 0,
    };

    try {
      if (!authUser?.email) {
        return { success: false, message: "Please login again." };
      }
      
      const saved = await dailyAPI.add(newEntry, authUser.email);
      const nextDaily = { ...daily };
      nextDaily[monthName] = nextDaily[monthName] ? [...nextDaily[monthName]] : [];
      nextDaily[monthName].push({ ...newEntry, _id: saved._id });
      setDaily(nextDaily);
      setActiveMonth(monthName);
      return { success: true };
    } catch (error) {
      console.error("Error adding daily entry to MongoDB:", error);
      return { success: false, message: "Unable to save daily entry." };
    }
  }

  async function updateDailyEntry(month, index, entry) {
    const date = entry.date.trim();
    if (!date) return { success: false, message: "Please choose a valid date." };
    const validation = validateDailyEntry(entry, { month, index });
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }
    const parsed = new Date(date);
    const monthName = parsed.toLocaleString("en-US", { month: "long" }) || month;
    const dayName = entry.day.trim() || parsed.toLocaleString("en-US", { weekday: "long" });
    const nextDaily = { ...daily };
    if (!nextDaily[monthName]) nextDaily[monthName] = [];
    const currentRow = daily[month]?.[index];
    const updatedEntry = {
      date,
      month: monthName,
      day: dayName,
      client: entry.client.trim(),
      project: entry.project.trim(),
      jobType: entry.jobType.trim() || "Work",
      b: Number(entry.b) || 0,
      nb: Number(entry.nb) || 0,
    };

    try {
      if (currentRow?._id) {
        await dailyAPI.update(currentRow._id, updatedEntry);
      } else {
        const saved = await dailyAPI.add(updatedEntry, authUser.email);
        updatedEntry._id = saved._id;
      }
    } catch (error) {
      console.error("Error updating daily entry in MongoDB:", error);
      return { success: false, message: "Unable to update daily entry." };
    }

    if (monthName === month) {
      nextDaily[monthName] = nextDaily[monthName].map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...updatedEntry } : row
      );
    } else {
      nextDaily[month] = nextDaily[month]?.filter((_, rowIndex) => rowIndex !== index) || [];
      nextDaily[monthName] = [...(nextDaily[monthName] || []), { ...updatedEntry, _id: currentRow?._id }];
    }

    setDaily(nextDaily);
    setActiveMonth(monthName);
    return { success: true };
  }

  async function deleteDailyEntry(month, index) {
    const row = daily[month]?.[index];
    if (row?._id) {
      try {
        await dailyAPI.delete(row._id);
      } catch (error) {
        console.error("Error deleting daily entry from MongoDB:", error);
      }
    }
    const nextDaily = { ...daily };
    nextDaily[month] = nextDaily[month]?.filter((_, rowIndex) => rowIndex !== index) || [];
    setDaily(nextDaily);
  }

  function setMonth(month) {
    setActiveMonth(month);
  }

  function switchSheet(name) {
    setActiveSheet(name);
  }

  function logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_ENABLED_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthUser(null);
    setProjects(defaultProjects);
    setDaily(initialDaily);
    // setMonthly(initialMonthly);
    setActiveSheet("projects");
    setActiveMonth("");
    setSearchQuery("");
    setFilters({ f0: "", f1: "", f2: "", f3: "", f4: "", f6: "", f7: "", f8: "" });
    setSortDir({});
    setChartsVisible(false);
    window.dispatchEvent(new Event("app-auth-updated"));
  }

  function toggleFilters() {
    setFiltersVisible((prev) => !prev);
  }

  function toggleCharts() {
    setChartsVisible((prev) => !prev);
  }

  const summary = useMemo(() => {
    const total = projects.length;
  
    const delivered = projects.filter(p => p.status === "Delivered").length;
  
    const inProgress = projects.filter(p => p.status === "In Progress").length;
  
    const hours = projects.reduce((sum, p) => sum + (Number(p.hours) || 0), 0);
  
    const clients = new Set(projects.map(p => p.client)).size;
  
    return {
      total,
      delivered,
      inProgress,
      hours,
      clients
    };
  }, [projects]);

  const dailySummary = useMemo(() => {
    const rows = daily[activeMonth] || [];
    const billable = rows.reduce((sum, row) => sum + (Number(row.b) || 0), 0);
    const nonBillable = rows.reduce((sum, row) => sum + (Number(row.nb) || 0), 0);
    const total = billable + nonBillable;
    return {
      days: rows.length,
      billable,
      nonBillable,
      total,
      billablePct: total > 0 ? ((billable / total) * 100).toFixed(1) : 0,
    };
  }, [daily, activeMonth]);

  const monthly = useMemo(() => {
    return Object.keys(daily).map((month) => {
      const rows = daily[month] || [];
  
      const billable = rows.reduce((sum, r) => sum + (Number(r.b) || 0), 0);
      const nonBillable = rows.reduce((sum, r) => sum + (Number(r.nb) || 0), 0);
      const total = billable + nonBillable;
  
      return {
        month,
        total,
        billable,
        nonBillable,
      };
    });
  }, [daily]);
  const yearlySummary = useMemo(() => {
    const total = monthly.reduce((sum, item) => sum + item.total, 0);
    const billable = monthly.reduce((sum, item) => sum + item.billable, 0);
    return {
      total,
      billable,
      nonBillable: total - billable,
      billablePct: total > 0 ? ((billable / total) * 100).toFixed(1) : 0,
    };
  }, [monthly]);

  return (
    <AppContext.Provider
      value={{
        projects,
        daily,
        monthly,
        filteredProjects,
        activeSheet,
        activeMonth,
        chartsVisible,
        filtersVisible,
        modalOpen,
        editingIndex,
        modalValues,
        searchQuery,
        filters,
        summary,
        authUser,
        dailySummary,
        yearlySummary,
        setSearchQuery,
        setFilters,
        switchSheet,
        toggleFilters,
        toggleCharts,
        clearFilters,
        sortTable,
        deleteProject,
        openAddProject,
        editProject,
        saveProject,
        closeModal,
        setModalValues,
        addDailyEntry,
        updateDailyEntry,
        deleteDailyEntry,
        setMonth,
        target,
        setTarget,
        exportCSV,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

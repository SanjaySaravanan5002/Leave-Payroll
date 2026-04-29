import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(() => {
    setError("");
    if (user.role === "Employee") {
      api.get("/leaves").then((response) => setLeaves(response.data)).catch((err) => setError(err.response?.data?.message || "Unable to load leave summary"));
      if (user.employee?._id) api.get(`/payroll/${user.employee._id}`).then((response) => setPayroll(response.data)).catch((err) => setError(err.response?.data?.message || "Unable to load payroll summary"));
    } else {
      api.get("/reports/summary").then((response) => setSummary(response.data)).catch((err) => setError(err.response?.data?.message || "Unable to load dashboard summary"));
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
    const timer = window.setInterval(loadDashboard, 15000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  if (user.role === "Employee") {
    const pending = leaves.filter((leave) => leave.status === "Pending").length;
    const approved = leaves.filter((leave) => leave.status === "Approved").length;
    const leaveBalance = user.employee?.leaveBalance || {};
    return (
      <section>
        <div className="page-title">
          <h2>Employee Dashboard</h2>
          <p>Track leave requests, balances, and salary slips.</p>
        </div>
        {error && <div className="alert">{error}</div>}
        <div className="stats-grid">
          <StatCard label="Pending Leaves" value={pending} tone="warning" />
          <StatCard label="Approved Leaves" value={approved} tone="success" />
          <StatCard label="Payslips" value={payroll.length} />
          <StatCard label="Casual Balance" value={leaveBalance.Casual ?? 0} />
          <StatCard label="Sick Balance" value={leaveBalance.Sick ?? 0} />
          <StatCard label="Paid Balance" value={leaveBalance.Paid ?? 0} />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="page-title">
        <h2>{user.role === "Admin" ? "Admin Dashboard" : "HR Dashboard"}</h2>
        <p>Monitor workforce, leave approvals, and payroll activity.</p>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Active Employees" value={summary?.employees ?? "..."} />
        <StatCard label="Pending Leaves" value={summary?.leaves?.pending ?? "..."} tone="warning" />
        <StatCard label="Approved Leaves" value={summary?.leaves?.approved ?? "..."} tone="success" />
        <StatCard label="Recent Payroll Total" value={summary ? `Rs. ${summary.payroll.recentNetTotal.toLocaleString()}` : "..."} />
      </div>
    </section>
  );
};

export default Dashboard;

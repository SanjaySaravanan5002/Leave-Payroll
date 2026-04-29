import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const Payroll = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(user.employee?._id || "");
  const [payroll, setPayroll] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const canProcess = ["Admin", "HR Manager"].includes(user.role);

  const loadEmployees = useCallback(() => {
    if (!canProcess) return;

    api
      .get("/employees")
      .then((response) => setEmployees(response.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load employees"));
  }, [canProcess]);

  const loadPayroll = useCallback((silent = false) => {
    if (!selectedEmployee) {
      setPayroll([]);
      return;
    }

    if (!silent) setLoading(true);
    setError("");
    api
      .get(`/payroll/${selectedEmployee}`)
      .then((response) => setPayroll(response.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load payroll history"))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [selectedEmployee]);

  useEffect(() => {
    loadEmployees();
    const timer = window.setInterval(loadEmployees, 20000);
    return () => window.clearInterval(timer);
  }, [loadEmployees]);

  useEffect(() => {
    loadPayroll();
    const timer = window.setInterval(() => loadPayroll(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadPayroll]);

  const employeeOptions = useMemo(() => (canProcess ? employees : [user.employee]).filter(Boolean), [canProcess, employees, user.employee]);

  const processPayroll = async () => {
    setMessage("");
    setError("");
    setProcessing(true);
    try {
      const response = await api.post("/payroll/process", { month });
      setMessage(`Payroll processed for ${response.data.count} employees`);
      loadPayroll(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process payroll");
    } finally {
      setProcessing(false);
    }
  };

  const downloadPayslip = (item) => {
    const html = `
      <html>
        <head>
          <title>PeopleCore HR Payslip ${item.month}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 14px; margin-bottom: 22px; }
            h1 { margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            td { border-bottom: 1px solid #d8dee8; padding: 12px; }
            .net { font-size: 22px; font-weight: 800; color: #087f5b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PeopleCore HR Payslip</h1>
            <p>${item.month}</p>
          </div>
          <p><strong>Employee:</strong> ${item.employee.name}</p>
          <p><strong>Department:</strong> ${item.employee.department}</p>
          <table>
            <tr><td>Basic Salary</td><td>Rs. ${item.basicSalary.toLocaleString()}</td></tr>
            <tr><td>Allowances</td><td>Rs. ${item.allowances.toLocaleString()}</td></tr>
            <tr><td>Leave Days</td><td>${item.leaveDays}</td></tr>
            <tr><td>Deductions</td><td>Rs. ${item.deductions.toLocaleString()}</td></tr>
            <tr><td>Net Salary</td><td class="net">Rs. ${item.netSalary.toLocaleString()}</td></tr>
          </table>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${item.month}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="page-title">
        <h2>Payroll Management</h2>
        <p>Process monthly salaries and generate payslips.</p>
      </div>
      <div className="panel toolbar">
        {canProcess && (
          <>
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
            <button onClick={processPayroll} disabled={processing}>{processing ? "Processing..." : "Process payroll"}</button>
          </>
        )}
        <select value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)}>
          <option value="">Select employee</option>
          {employeeOptions.map((employee) => (
            <option key={employee._id} value={employee._id}>{employee.name}</option>
          ))}
        </select>
      </div>
      {message && <div className="success">{message}</div>}
      {error && <div className="alert">{error}</div>}
      <div className="panel">
        <h3>Payroll History</h3>
        {loading ? (
          <div className="empty-state">Loading payroll history...</div>
        ) : !selectedEmployee ? (
          <div className="empty-state">Select an employee to view payroll.</div>
        ) : payroll.length === 0 ? (
          <div className="empty-state">No payroll records found.</div>
        ) : (
          <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Basic</th>
                <th>Allowances</th>
                <th>Leave Days</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((item) => (
                <tr key={item._id}>
                  <td>{item.month}</td>
                  <td>Rs. {item.basicSalary.toLocaleString()}</td>
                  <td>Rs. {item.allowances.toLocaleString()}</td>
                  <td>{item.leaveDays}</td>
                  <td>Rs. {item.deductions.toLocaleString()}</td>
                  <td>Rs. {item.netSalary.toLocaleString()}</td>
                  <td><button onClick={() => downloadPayslip(item)}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </section>
  );
};

export default Payroll;

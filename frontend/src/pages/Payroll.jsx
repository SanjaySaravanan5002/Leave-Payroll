import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const Payroll = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(user.employee?._id || "");
  const [payroll, setPayroll] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const canProcess = ["Admin", "HR Manager"].includes(user.role);

  useEffect(() => {
    if (canProcess) api.get("/employees").then((response) => setEmployees(response.data));
  }, [canProcess]);

  useEffect(() => {
    if (selectedEmployee) api.get(`/payroll/${selectedEmployee}`).then((response) => setPayroll(response.data));
  }, [selectedEmployee]);

  const employeeOptions = useMemo(() => (canProcess ? employees : [user.employee]).filter(Boolean), [canProcess, employees, user.employee]);

  const processPayroll = async () => {
    await api.post("/payroll/process", { month });
    if (selectedEmployee) {
      const response = await api.get(`/payroll/${selectedEmployee}`);
      setPayroll(response.data);
    }
  };

  const downloadPayslip = (item) => {
    const html = `<html><body><h1>Payslip ${item.month}</h1><p>Employee: ${item.employee.name}</p><p>Basic: ${item.basicSalary}</p><p>Allowances: ${item.allowances}</p><p>Deductions: ${item.deductions}</p><h2>Net Salary: ${item.netSalary}</h2></body></html>`;
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
            <button onClick={processPayroll}>Process payroll</button>
          </>
        )}
        <select value={selectedEmployee} onChange={(event) => setSelectedEmployee(event.target.value)}>
          <option value="">Select employee</option>
          {employeeOptions.map((employee) => (
            <option key={employee._id} value={employee._id}>{employee.name}</option>
          ))}
        </select>
      </div>
      <div className="panel">
        <h3>Payroll History</h3>
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
      </div>
    </section>
  );
};

export default Payroll;

import { useEffect, useState } from "react";
import api from "../api/client";
import StatCard from "../components/StatCard.jsx";

const Reports = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/reports/summary").then((response) => setSummary(response.data));
  }, []);

  return (
    <section>
      <div className="page-title">
        <h2>Reports</h2>
        <p>Monthly payroll and leave statistics.</p>
      </div>
      <div className="stats-grid">
        <StatCard label="Employees" value={summary?.employees ?? "..."} />
        <StatCard label="Pending Leave" value={summary?.leaves?.pending ?? "..."} tone="warning" />
        <StatCard label="Approved Leave" value={summary?.leaves?.approved ?? "..."} tone="success" />
        <StatCard label="Rejected Leave" value={summary?.leaves?.rejected ?? "..."} tone="danger" />
      </div>
      <div className="panel">
        <h3>Latest Payroll</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Month</th>
                <th>Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {summary?.payroll.latest.map((item) => (
                <tr key={item._id}>
                  <td>{item.employee.name}</td>
                  <td>{item.employee.department}</td>
                  <td>{item.month}</td>
                  <td>Rs. {item.netSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Reports;

import { useEffect, useState } from "react";
import api from "../api/client";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  salary: "",
  allowances: "",
  joiningDate: "",
  role: "Employee",
  password: "Employee@123"
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const loadEmployees = () => api.get("/employees").then((response) => setEmployees(response.data));

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    await api.post("/employees", {
      ...form,
      salary: Number(form.salary),
      allowances: Number(form.allowances || 0)
    });
    setForm(emptyForm);
    setMessage("Employee created successfully");
    loadEmployees();
  };

  return (
    <section>
      <div className="page-title">
        <h2>Employee Management</h2>
        <p>Add, update, and deactivate employee profiles.</p>
      </div>
      <div className="split-grid">
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <h3>Add Employee</h3>
          <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input placeholder="Department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required />
          <input placeholder="Basic salary" type="number" value={form.salary} onChange={(event) => setForm({ ...form, salary: event.target.value })} required />
          <input placeholder="Allowances" type="number" value={form.allowances} onChange={(event) => setForm({ ...form, allowances: event.target.value })} />
          <input type="date" value={form.joiningDate} onChange={(event) => setForm({ ...form, joiningDate: event.target.value })} required />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option>Employee</option>
            <option>HR Manager</option>
            <option>Admin</option>
          </select>
          <input placeholder="Initial password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          {message && <div className="success">{message}</div>}
          <button>Create employee</button>
        </form>
        <div className="panel">
          <h3>Employees</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.department}</td>
                    <td>{employee.role}</td>
                    <td>Rs. {employee.salary.toLocaleString()}</td>
                    <td>{employee.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Employees;

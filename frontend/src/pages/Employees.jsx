import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

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

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isAdmin = user.role === "Admin";
  const roleOptions = isAdmin ? ["Employee", "HR Manager", "Admin"] : ["Employee"];

  const loadEmployees = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load employees");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
    const timer = window.setInterval(() => loadEmployees(true), 20000);
    return () => window.clearInterval(timer);
  }, [loadEmployees]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const editEmployee = (employee) => {
    setEditingId(employee._id);
    setMessage("");
    setError("");
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary),
      allowances: String(employee.allowances || 0),
      joiningDate: toDateInput(employee.joiningDate),
      role: employee.role,
      password: ""
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        allowances: Number(form.allowances || 0)
      };

      if (editingId) {
        const { email, password, ...updatePayload } = payload;
        await api.put(`/employees/${editingId}`, updatePayload);
        setMessage("Employee updated successfully");
      } else {
        await api.post("/employees", payload);
        setMessage("Employee created successfully");
      }

      resetForm();
      loadEmployees(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save employee");
    } finally {
      setSaving(false);
    }
  };

  const deactivateEmployee = async (employee) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/employees/${employee._id}`);
      setMessage(`${employee.name} deactivated`);
      loadEmployees(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to deactivate employee");
    }
  };

  return (
    <section>
      <div className="page-title">
        <h2>Employee & Login Management</h2>
        <p>Create employee accounts and share their email login ID with the initial password.</p>
      </div>
      <div className="split-grid">
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update Employee" : "Create Employee Login"}</h3>
          <label>
            Employee name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Email / Login ID
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} disabled={Boolean(editingId)} required />
          </label>
          <label>
            Department
            <input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required />
          </label>
          <div className="auth-two-col">
            <label>
              Basic salary
              <input type="number" min="0" value={form.salary} onChange={(event) => setForm({ ...form, salary: event.target.value })} required />
            </label>
            <label>
              Allowances
              <input type="number" min="0" value={form.allowances} onChange={(event) => setForm({ ...form, allowances: event.target.value })} />
            </label>
          </div>
          <label>
            Joining date
            <input type="date" value={form.joiningDate} onChange={(event) => setForm({ ...form, joiningDate: event.target.value })} required />
          </label>
          <label>
            Account role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            {roleOptions.map((role) => <option key={role}>{role}</option>)}
          </select>
          </label>
          {!editingId && (
            <label>
              Initial password
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
            </label>
          )}
          {!editingId && (
            <div className="credential-note">
              <strong>Employee login credentials</strong>
              <span>Login ID: {form.email || "employee email"}</span>
              <span>Password: {form.password || "set initial password"}</span>
            </div>
          )}
          {message && <div className="success">{message}</div>}
          {error && <div className="alert">{error}</div>}
          <div className="actions">
            <button disabled={saving}>{saving ? "Saving..." : editingId ? "Update employee" : "Create employee"}</button>
            {editingId && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
        <div className="panel">
          <h3>Employees</h3>
          {loading ? (
            <div className="empty-state">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="empty-state">No employees found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Action</th>
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
                      <td className="actions">
                        <button type="button" className="secondary" onClick={() => editEmployee(employee)}>Edit</button>
                        {isAdmin && employee.isActive && <button type="button" className="danger" onClick={() => deactivateEmployee(employee)}>Deactivate</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Employees;

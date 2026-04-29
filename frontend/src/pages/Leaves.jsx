import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ fromDate: "", toDate: "", type: "Casual", reason: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLeaves = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await api.get("/leaves");
      setLeaves(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load leave requests");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
    const timer = window.setInterval(() => loadLeaves(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadLeaves]);

  const applyLeave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await api.post("/leaves", form);
      setForm({ fromDate: "", toDate: "", type: "Casual", reason: "" });
      setMessage("Leave request submitted");
      loadLeaves(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit leave request");
    } finally {
      setSaving(false);
    }
  };

  const reviewLeave = async (id, status) => {
    setMessage("");
    setError("");
    try {
      await api.put(`/leaves/${id}`, { status });
      setMessage(`Leave ${status.toLowerCase()}`);
      loadLeaves(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to review leave request");
    }
  };

  return (
    <section>
      <div className="page-title">
        <h2>Leave Management</h2>
        <p>Apply, approve, and track leave requests.</p>
      </div>
      <div className="split-grid">
        {user.role === "Employee" && (
          <form className="panel form-grid" onSubmit={applyLeave}>
            <h3>Apply Leave</h3>
            <input type="date" value={form.fromDate} onChange={(event) => setForm({ ...form, fromDate: event.target.value })} required />
            <input type="date" value={form.toDate} onChange={(event) => setForm({ ...form, toDate: event.target.value })} required />
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option>Casual</option>
              <option>Sick</option>
              <option>Paid</option>
            </select>
            <textarea placeholder="Reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required />
            {message && <div className="success">{message}</div>}
            {error && <div className="alert">{error}</div>}
            <button disabled={saving}>{saving ? "Submitting..." : "Submit request"}</button>
          </form>
        )}
        <div className="panel wide">
          <h3>Leave Requests</h3>
          {user.role !== "Employee" && message && <div className="success">{message}</div>}
          {user.role !== "Employee" && error && <div className="alert">{error}</div>}
          {loading ? (
            <div className="empty-state">Loading leave requests...</div>
          ) : leaves.length === 0 ? (
            <div className="empty-state">No leave requests found.</div>
          ) : (
            <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  {user.role !== "Employee" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.employee?.name || "Me"}</td>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.days}</td>
                    <td><span className={`badge ${leave.status.toLowerCase()}`}>{leave.status}</span></td>
                    {user.role !== "Employee" && (
                      <td className="actions">
                        {leave.status === "Pending" ? (
                          <>
                            <button onClick={() => reviewLeave(leave._id, "Approved")}>Approve</button>
                            <button className="danger" onClick={() => reviewLeave(leave._id, "Rejected")}>Reject</button>
                          </>
                        ) : (
                          "Reviewed"
                        )}
                      </td>
                    )}
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

export default Leaves;

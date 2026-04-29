import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ fromDate: "", toDate: "", type: "Casual", reason: "" });
  const [message, setMessage] = useState("");

  const loadLeaves = () => api.get("/leaves").then((response) => setLeaves(response.data));

  useEffect(() => {
    loadLeaves();
  }, []);

  const applyLeave = async (event) => {
    event.preventDefault();
    await api.post("/leaves", form);
    setForm({ fromDate: "", toDate: "", type: "Casual", reason: "" });
    setMessage("Leave request submitted");
    loadLeaves();
  };

  const reviewLeave = async (id, status) => {
    await api.put(`/leaves/${id}`, { status });
    loadLeaves();
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
            <button>Submit request</button>
          </form>
        )}
        <div className="panel wide">
          <h3>Leave Requests</h3>
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
        </div>
      </div>
    </section>
  );
};

export default Leaves;

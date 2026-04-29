import { useCallback, useEffect, useState } from "react";
import api from "../api/client";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    api
      .get("/audit-logs")
      .then((response) => setLogs(response.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load audit logs"))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadLogs();
    const timer = window.setInterval(() => loadLogs(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadLogs]);

  return (
    <section>
      <div className="page-title">
        <h2>Audit Logs</h2>
        <p>Security and operational activity trail.</p>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="panel">
        {loading ? (
          <div className="empty-state">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">No audit logs found.</div>
        ) : (
          <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Entity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.action}</td>
                  <td>{log.performedBy?.email || "System"}</td>
                  <td>{log.entity}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
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

export default AuditLogs;

import { useEffect, useState } from "react";
import api from "../api/client";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit-logs").then((response) => setLogs(response.data));
  }, []);

  return (
    <section>
      <div className="page-title">
        <h2>Audit Logs</h2>
        <p>Security and operational activity trail.</p>
      </div>
      <div className="panel">
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
      </div>
    </section>
  );
};

export default AuditLogs;

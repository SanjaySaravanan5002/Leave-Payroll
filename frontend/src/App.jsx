import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Leaves from "./pages/Leaves.jsx";
import Payroll from "./pages/Payroll.jsx";
import Reports from "./pages/Reports.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<ProtectedRoute roles={["Admin", "HR Manager"]} />}>
          <Route path="/employees" element={<Employees />} />
        </Route>
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route element={<ProtectedRoute roles={["Admin", "HR Manager"]} />}>
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route element={<ProtectedRoute roles={["Admin"]} />}>
          <Route path="/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;

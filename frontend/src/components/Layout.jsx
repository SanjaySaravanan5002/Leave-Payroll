import { Building2, ClipboardCheck, FileBarChart, LogOut, ReceiptText, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: Building2, roles: ["Admin", "HR Manager", "Employee"] },
  { label: "Employees", path: "/employees", icon: Users, roles: ["Admin", "HR Manager"] },
  { label: "Leaves", path: "/leaves", icon: ClipboardCheck, roles: ["Admin", "HR Manager", "Employee"] },
  { label: "Payroll", path: "/payroll", icon: ReceiptText, roles: ["Admin", "HR Manager", "Employee"] },
  { label: "Reports", path: "/reports", icon: FileBarChart, roles: ["Admin", "HR Manager"] },
  { label: "Audit", path: "/audit-logs", icon: ShieldCheck, roles: ["Admin"] }
];

const Layout = () => {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">LP</div>
          <div>
            <strong>Leave Payroll</strong>
            <span>Enterprise Suite</span>
          </div>
        </div>
        <nav>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <button className="logout" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span className="muted">Signed in as</span>
            <h1>{user.role}</h1>
          </div>
          <div className="profile-chip">{user.email}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

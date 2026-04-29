import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@company.com", password: "Admin@123" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-icon">
          <LockKeyhole size={30} />
        </div>
        <h1>Leave & Payroll Management</h1>
        <p>Secure HR operations for employees, leave approvals, payroll and reports.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
          </label>
          <label>
            Password
            <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
          </label>
          {error && <div className="alert">{error}</div>}
          <button disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
};

export default Login;

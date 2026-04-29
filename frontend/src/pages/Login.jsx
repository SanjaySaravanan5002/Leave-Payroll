import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import BrandLogo from "../components/BrandLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-screen auth-screen">
      <section className="auth-card auth-card-compact">
        <BrandLogo />
        <p className="auth-subtitle">Sign in with your company credentials.</p>

        <div className="login-icon auth-icon">
          <LockKeyhole size={28} />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email / Login ID
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button type="button" className="icon-button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && <div className="alert">{error}</div>}
          <button className="login-submit" disabled={submitting}>{submitting ? "Signing in..." : "Login"}</button>
        </form>
      </section>
    </main>
  );
};

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Tag } from "lucide-react";
import { API_URL } from "../config.js";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Completá todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("businessName", data.businessName);
      localStorage.setItem("role", data.role);
      localStorage.setItem("businessId", data.businessId);
      navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Tag size={22} />
        </div>
        <span className="auth-logo-name">Precify</span>
      </div>

      <h1 className="auth-title">Bienvenido de vuelta</h1>
      <p className="auth-subtitle">Ingresá tus datos para continuar</p>

      <div className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              className="input-field"
              type="email"
              placeholder="tu@negocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <div className="auth-input-wrap">
            <Lock size={16} className="auth-input-icon" />
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <button
              className="auth-input-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          className="auth-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          <ArrowRight size={18} />
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      <div className="auth-footer">
        <p>
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
        <p className="auth-footer-spacing">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/forgot-password">Recuperala acá</Link>
        </p>
      </div>
    </div>
  );
};

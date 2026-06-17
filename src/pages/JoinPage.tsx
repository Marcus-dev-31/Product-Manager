import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Tag, Hash } from "lucide-react";
import { API_URL } from "../config.js";

export function JoinPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !inviteCode) {
      setError("Completá todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al unirse al negocio");
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

      <h1 className="auth-title">Unirse a un negocio</h1>
      <p className="auth-subtitle">
        Ingresá el código que te compartió el admin
      </p>

      <div className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Código de invitación</label>
          <div className="auth-input-wrap">
            <Hash size={16} className="auth-input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="ej. 5b07398e-333e-4512..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="auth-input-wrap">
            <Mail size={16} className="auth-input-icon" />
            <input
              className="input-field"
              type="email"
              placeholder="tu@email.com"
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
          {loading ? "Uniéndose..." : "Unirse al negocio"}
        </button>
      </div>

      <div className="auth-footer">
        <p>
          ¿Querés crear tu propio negocio?{" "}
          <Link to="/register">Registrate</Link>
        </p>
        <p style={{ marginTop: 8 }}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

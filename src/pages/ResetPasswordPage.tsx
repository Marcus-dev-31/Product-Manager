import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Tag } from "lucide-react";
import { API_URL } from "../config.js";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Completá todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      setError("Token inválido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/email/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al restablecer la contraseña");
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Tag size={22} />
          </div>
          <span className="auth-logo-name">Precify</span>
        </div>
        <h1 className="auth-title">Link inválido</h1>
        <p className="auth-subtitle">Este link no es válido o ya expiró.</p>
        <div className="auth-footer">
          <p>
            <Link to="/forgot-password">Solicitá uno nuevo</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Tag size={22} />
        </div>
        <span className="auth-logo-name">Precify</span>
      </div>

      <h1 className="auth-title">Nueva contraseña</h1>
      <p className="auth-subtitle">Ingresá tu nueva contraseña</p>

      {success ? (
        <div className="auth-form">
          <div className="auth-success">
            ✓ Contraseña actualizada. Redirigiendo al login...
          </div>
        </div>
      ) : (
        <div className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Nueva contraseña</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
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

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                className="input-field"
                type={showPassword ? "text" : "password"}
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>
          </div>

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            <ArrowRight size={18} />
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </div>
      )}

      <div className="auth-footer">
        <p>
          ¿Recordaste tu contraseña? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}

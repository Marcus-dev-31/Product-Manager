import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Tag } from "lucide-react";
import { API_URL } from "../config.js";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Ingresá tu email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSent(true);
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

      <h1 className="auth-title">Recuperar contraseña</h1>
      <p className="auth-subtitle">
        Ingresá tu email y te mandamos un link para restablecer tu contraseña
      </p>

      {sent ? (
        <div className="auth-form">
          <div className="auth-success">
            ✓ Si el email existe, vas a recibir un link en los próximos minutos
          </div>
          <Link
            to="/login"
            className="auth-submit"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Volver al login
          </Link>
        </div>
      ) : (
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
          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            <ArrowRight size={18} />
            {loading ? "Enviando..." : "Enviar link"}
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

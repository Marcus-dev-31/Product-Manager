import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function JoinPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
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
      const res = await fetch(
        "https://product-manager-production-e899.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, inviteCode }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al unirse al negocio");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("businessName", data.businessName);
      navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">P</span>
          <span className="auth-logo-text">Precify</span>
        </div>
        <h1 className="auth-title">Unirse a un negocio</h1>
        <p className="auth-subtitle">
          Ingresá el código que te compartió el admin
        </p>

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Código de invitación</label>
            <div className="auth-input-wrap">
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
            <label className="form-label">Email</label>
            <div className="auth-input-wrap">
              <input
                className="input-field"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="auth-input-wrap">
              <input
                className="input-field"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uniéndose..." : "Unirse al negocio"}
          </button>

          <p className="auth-footer">
            ¿Querés crear tu propio negocio?{" "}
            <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

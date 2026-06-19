import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Building2, ArrowLeft, Sparkles } from "lucide-react";
import { API_URL } from "../config.js";

const BRAND_COLORS = ["#E8590C", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899"];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(BRAND_COLORS[0]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!businessName || !email || !password) {
      setError("Completá todos los campos");
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ businessName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }

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
      <button className="auth-back-btn" onClick={() => navigate("/login")}>
        <ArrowLeft size={18} />
      </button>

      <h1 className="auth-title" style={{ marginTop: 16 }}>
        Creá tu negocio
      </h1>
      <p className="auth-subtitle">Configurá tu espacio en Precify</p>

      <div className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Nombre del negocio</label>
          <div className="auth-input-wrap">
            <Building2 size={16} className="auth-input-icon" />
            <input
              className="input-field"
              type="text"
              placeholder="ej. Kiosco Don José"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
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
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Color de tu marca</label>
          <div className="color-picker">
            {BRAND_COLORS.map((color) => (
              <button
                key={color}
                className={`color-dot ${selectedColor === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        <button
          className="auth-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Sparkles size={18} />
          {loading ? "Creando negocio..." : "Crear negocio"}
        </button>
      </div>

      <div className="auth-footer">
        <p>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateBusiness } from "../services/businessService.js";

export function SettingsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem("businessName") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await updateBusiness(name);
      localStorage.setItem("businessName", res.businessName);
      setSuccess(true);
    } catch {
      setError("No se pudo actualizar el nombre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate("/")}>
          ←
        </button>
        <h2>Configuración</h2>
      </div>

      <div className="settings-section">
        <label className="settings-label">Nombre del negocio</label>
        <input
          className="settings-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del negocio"
        />
        {error && <p className="settings-error">{error}</p>}
        {success && <p className="settings-success">¡Guardado!</p>}
        <button
          className="settings-save"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

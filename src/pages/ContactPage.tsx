import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { API_URL } from "../config.js";

export function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"peticion" | "consulta" | "proyecto">(
    "peticion",
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      setError("Completá todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al enviar el mensaje");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Error de conexión con el servidor");
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
        <h2>Contacto</h2>
      </div>

      {success ? (
        <div className="contact-success">
          <p className="contact-success-title">¡Mensaje enviado!</p>
          <p className="contact-success-text">
            Gracias por escribirnos. Te respondemos a la brevedad.
          </p>
          <button className="settings-save" onClick={() => navigate("/")}>
            Volver a la app
          </button>
        </div>
      ) : (
        <div className="settings-section">
          {error && <p className="settings-error">{error}</p>}

          <div className="contact-field">
            <label className="settings-label">Nombre</label>
            <input
              className="settings-input"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="contact-field">
            <label className="settings-label">Email</label>
            <input
              className="settings-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="contact-field">
            <label className="settings-label">Tipo de consulta</label>
            <select
              className="settings-input"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "peticion" | "consulta" | "proyecto")
              }
            >
              <option value="peticion">Peticion</option>
              <option value="consulta">Consulta</option>
              <option value="proyecto">Proyecto personalizado</option>
            </select>
          </div>

          <div className="contact-field">
            <label className="settings-label">Mensaje</label>
            <textarea
              className="settings-input contact-textarea"
              placeholder="Escribí tu mensaje acá..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          <button
            className="settings-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Enviando..."
            ) : (
              <>
                <ArrowRight size={16} />
                Enviar mensaje
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

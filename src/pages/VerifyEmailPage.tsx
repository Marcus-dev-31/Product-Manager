import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tag } from "lucide-react";
import { API_URL } from "../config.js";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Token inválido");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/email/verify?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setError(data.error || "Error al verificar el email");
        }
      } catch {
        setStatus("error");
        setError("Error de conexión con el servidor");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Tag size={22} />
        </div>
        <span className="auth-logo-name">Precify</span>
      </div>

      {status === "loading" && (
        <>
          <h1 className="auth-title">Verificando...</h1>
          <p className="auth-subtitle">Estamos verificando tu email</p>
        </>
      )}

      {status === "success" && (
        <>
          <h1 className="auth-title">¡Email verificado!</h1>
          <p className="auth-subtitle">Tu email fue verificado correctamente</p>
          <div className="auth-form">
            <div className="auth-success">
              ✓ Ya podés usar todas las funciones de Precify
            </div>
            <Link to="/" className="auth-submit auth-submit-link">
              Ir a la app
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="auth-title">Link inválido</h1>
          <p className="auth-subtitle">{error}</p>
          <div className="auth-footer">
            <p>
              <Link to="/login">Volver al login</Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

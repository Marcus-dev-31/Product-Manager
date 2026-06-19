import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../config.js";
import {
  Settings,
  LogOut,
  X,
  Menu,
  Users,
  ArrowLeftRight,
  MessageSquare,
} from "lucide-react";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // si falla el request igual lo deslogueo en el frontend
    }
    localStorage.removeItem("businessName");
    localStorage.removeItem("role");
    localStorage.removeItem("businessId");
    window.location.href = "/login";
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  const handleTeam = () => {
    setOpen(false);
    navigate("/team");
  };

  const handleImportExport = () => {
    setOpen(false);
    navigate("/import-export");
  };

  const handleContact = () => {
    setOpen(false);
    navigate("/contact");
  };

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="hamburger-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="hamburger-close" onClick={() => setOpen(false)}>
              <X size={24} />
            </button>

            <nav className="hamburger-nav">
              <button className="hamburger-item" onClick={handleTeam}>
                <Users size={20} />
                <span>Equipo</span>
              </button>
              <button className="hamburger-item" onClick={handleSettings}>
                <Settings size={20} />
                <span>Configuración</span>
              </button>
              <button
                className="hamburger-item hamburger-item--danger"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
              <button className="hamburger-item" onClick={handleImportExport}>
                <ArrowLeftRight size={20} />
                <span>Importar / Exportar</span>
              </button>
              <button className="hamburger-item" onClick={handleContact}>
                <MessageSquare size={20} />
                <span>Contacto</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

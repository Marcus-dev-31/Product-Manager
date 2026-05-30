import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTeam,
  getInviteCode,
  updateRole,
  removeUser,
  TeamMember,
} from "../services/teamService.js";

export function TeamPage() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [members, codeRes] = await Promise.all([
          getTeam(),
          getInviteCode(),
        ]);
        setTeam(members);
        setInviteCode(codeRes.inviteCode);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = async (id: string, role: "EDITOR" | "VIEWER") => {
    const updated = await updateRole(id, role);
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: updated.role } : m)),
    );
  };

  const handleRemove = async (id: string) => {
    await removeUser(id);
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const roleLabel = (role: string) => {
    if (role === "ADMIN") return "Admin";
    if (role === "EDITOR") return "Editor";
    return "Solo lectura";
  };

  if (loading) return <div className="team-loading">Cargando...</div>;

  return (
    <div className="team-page">
      <div className="team-header">
        <button className="settings-back" onClick={() => navigate("/")}>
          ←
        </button>
        <h2>Equipo</h2>
      </div>

      <div className="team-invite">
        <p className="team-invite-label">Código de invitación</p>
        <p className="team-invite-hint">
          Compartí este código y el link{" "}
          <strong>precify-eta.vercel.app/join</strong> con tu equipo
        </p>
        <div className="team-invite-row">
          <span className="team-invite-code">{inviteCode}</span>
          <button className="team-invite-copy" onClick={handleCopy}>
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="team-list">
        <p className="team-section-title">Usuarios ({team.length})</p>
        {team.map((member) => (
          <div key={member.id} className="team-member">
            <div className="team-member-info">
              <span className="team-member-email">{member.email}</span>
              <span
                className={`team-member-role team-member-role--${member.role.toLowerCase()}`}
              >
                {roleLabel(member.role)}
              </span>
            </div>
            {member.role !== "ADMIN" && (
              <div className="team-member-actions">
                <select
                  className="team-role-select"
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(
                      member.id,
                      e.target.value as "EDITOR" | "VIEWER",
                    )
                  }
                >
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Solo lectura</option>
                </select>
                <button
                  className="team-remove-btn"
                  onClick={() => handleRemove(member.id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

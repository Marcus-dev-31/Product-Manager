import { apiFetch } from "../utils/http.js";
import { API_URL } from "../config.js";

const TEAM_URL = `${API_URL}/api/team`;

export interface TeamMember {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  createdAt: string;
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const res = await apiFetch(TEAM_URL);
  if (!res.ok) throw new Error("Error al obtener el equipo");
  return res.json();
};

export const getInviteCode = async (): Promise<{ inviteCode: string }> => {
  const res = await apiFetch(`${TEAM_URL}/invite-code`);
  if (!res.ok) throw new Error("Error al obtener el código");
  return res.json();
};

export const updateRole = async (
  id: string,
  role: "EDITOR" | "VIEWER",
): Promise<TeamMember> => {
  const res = await apiFetch(`${TEAM_URL}/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Error al actualizar el rol");
  return res.json();
};

export const removeUser = async (id: string): Promise<void> => {
  const res = await apiFetch(`${TEAM_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el usuario");
};

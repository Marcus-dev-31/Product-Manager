import { apiFetch } from "../utils/http";

const API_URL =
  "https://product-manager-production-e899.up.railway.app/api/team";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface TeamMember {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  createdAt: string;
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const res = await apiFetch(API_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Error al obtener el equipo");
  return res.json();
};

export const getInviteCode = async (): Promise<{ inviteCode: string }> => {
  const res = await apiFetch(`${API_URL}/invite-code`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener el código");
  return res.json();
};

export const updateRole = async (
  id: string,
  role: "EDITOR" | "VIEWER",
): Promise<TeamMember> => {
  const res = await apiFetch(`${API_URL}/${id}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Error al actualizar el rol");
  return res.json();
};

export const removeUser = async (id: string): Promise<void> => {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar el usuario");
};

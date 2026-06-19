import { apiFetch } from "../utils/http.js";
import { API_URL } from "../config.js";

const BUSINESS_URL = `${API_URL}/api/business`;

export const updateBusiness = async (
  name: string,
): Promise<{ businessName: string }> => {
  const res = await apiFetch(BUSINESS_URL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Error al actualizar el negocio");
  return res.json();
};

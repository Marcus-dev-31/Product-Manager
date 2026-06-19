export async function apiFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("businessName");
    localStorage.removeItem("role");
    localStorage.removeItem("businessId");
    window.location.href = "/login";
  }

  return res;
}
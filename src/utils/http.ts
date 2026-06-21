function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const method = options?.method?.toUpperCase() ?? "GET";
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers = new Headers(options?.headers);
  if (mutating) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  const res = await fetch(url, {
    ...options,
    headers,
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

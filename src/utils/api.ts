// apiClient.ts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const saveTokens = (access: string, refresh?: string) => {
  localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) {
    // wait if another request is already refreshing
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<Response> => {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry) {
    // Try refreshing token once
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry original request with new token
      return apiFetch(url, options, false);
    }
  }

  return response;
};

export const apiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
};

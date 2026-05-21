import { ApiError } from "@/types/apiError";

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
    const body = await response.json().catch(() => ({}));

    // ASP.NET validation errors: ProblemDetails with an "errors" dict
    if (body.errors && typeof body.errors === "object") {
      throw new ApiError(
        body.title ?? "One or more validation errors occurred.",
        response.status,
        body.errors as Record<string, string[]>,
      );
    }

    // Application exceptions: ProblemDetails with a "detail" string
    if (body.detail) {
      throw new ApiError(body.detail as string, response.status);
    }

    throw new ApiError(
      body.title ?? `${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.status === 204 ? (undefined as T) : response.json();
};

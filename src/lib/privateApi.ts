import { ApiRequestError } from "@/lib/api";

export async function privateRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/proxy${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(
      "Cannot reach the server. Please check your connection.",
      0,
    );
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new ApiRequestError(
      body?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return body.data as T;
}
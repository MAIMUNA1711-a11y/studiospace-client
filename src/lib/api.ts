import type {
  Pagination,
  Review,
  Studio,
  StudioFilters,
  TimeSlot,
} from "@/types";

// Extra trailing slash (/) soriy e clean Base URL toiri kora
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
}

async function request<T>(path: string): Promise<Envelope<T>> {
  let res: Response;
  
  // Ensure single slash between base URL and path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_URL}${normalizedPath}`;

  try {
    res = await fetch(fullUrl, { cache: "no-store" });
  } catch {
    throw new ApiRequestError(
      "Cannot reach the server. Please check your connection and try again.",
      0,
    );
  }
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new ApiRequestError(
      body?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return body;
}

export async function getFeaturedStudios(): Promise<Studio[]> {
  return (await request<Studio[]>("/studios/featured")).data ?? [];
}

export async function getStudios(
  filters: StudioFilters = {},
): Promise<{ studios: Studio[]; pagination: Pagination }> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  const body = await request<Studio[]>(`/studios${qs ? `?${qs}` : ""}`);
  return {
    studios: body.data ?? [],
    pagination: body.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 1 },
  };
}

export async function getStudio(id: string): Promise<Studio> {
  return (await request<Studio>(`/studios/${id}`)).data as Studio;
}

export async function getReviews(id: string): Promise<Review[]> {
  return (await request<Review[]>(`/studios/${id}/reviews`)).data ?? [];
}

export async function getAvailability(
  studioId: string,
  date: string,
): Promise<TimeSlot[]> {
  const qs = new URLSearchParams({ studioId, date }).toString();
  return (await request<TimeSlot[]>(`/bookings/availability?${qs}`)).data ?? [];
}
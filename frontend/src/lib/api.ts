import type {
  Campaign,
  CampaignFormData,
  CategoryBudget,
  DashboardSummary,
  NewsArticle,
  StatusCount,
  TimeSeriesPoint,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GetCampaignsParams {
  status?: string;
  category?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.detail ??
      (typeof body?.detail === "object"
        ? JSON.stringify(body.detail)
        : `Request failed with status ${res.status}`);
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// Campaign endpoints

export async function getCampaigns(
  params?: GetCampaignsParams
): Promise<Campaign[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.category) query.set("category", params.category);
  if (params?.sort_by) query.set("sort_by", params.sort_by);
  if (params?.sort_order) query.set("sort_order", params.sort_order);
  const qs = query.toString();
  return fetchJSON<Campaign[]>(`/api/campaigns${qs ? `?${qs}` : ""}`);
}

export async function getCampaign(id: number): Promise<Campaign> {
  return fetchJSON<Campaign>(`/api/campaigns/${id}`);
}

export async function createCampaign(
  data: CampaignFormData
): Promise<Campaign> {
  return fetchJSON<Campaign>("/api/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCampaign(
  id: number,
  data: CampaignFormData
): Promise<Campaign> {
  return fetchJSON<Campaign>(`/api/campaigns/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCampaign(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/campaigns/${id}`, {
    method: "DELETE",
  });
}

// Dashboard endpoints

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchJSON<DashboardSummary>("/api/dashboard/summary");
}

export async function getStatusDistribution(): Promise<StatusCount[]> {
  return fetchJSON<StatusCount[]>("/api/dashboard/status-distribution");
}

export async function getBudgetByCategory(): Promise<CategoryBudget[]> {
  return fetchJSON<CategoryBudget[]>("/api/dashboard/budget-by-category");
}

export async function getCampaignsOverTime(): Promise<TimeSeriesPoint[]> {
  return fetchJSON<TimeSeriesPoint[]>("/api/dashboard/campaigns-over-time");
}

// News endpoint

export async function getNews(keyword?: string): Promise<NewsArticle[]> {
  const qs = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  return fetchJSON<NewsArticle[]>(`/api/news${qs}`);
}

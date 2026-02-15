export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: number;
  start_date: string;
  end_date: string;
  platform: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  platform: string;
  category: string;
}

export interface DashboardSummary {
  total_campaigns: number;
  total_budget: number;
  active_campaigns: number;
  average_budget: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface CategoryBudget {
  category: string;
  total_budget: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface NewsArticle {
  title: string;
  description: string | null;
  source: string;
  url: string;
  published_at: string;
}

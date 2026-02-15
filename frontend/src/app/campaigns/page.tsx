"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import CampaignForm from "@/components/CampaignForm";

const STATUS_OPTIONS = ["all", "draft", "active", "paused", "completed"] as const;
const CATEGORY_OPTIONS = [
  "all",
  "brand_awareness",
  "lead_generation",
  "sales",
  "engagement",
  "retention",
  "other",
] as const;

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  active: "bg-green-500/20 text-green-300 border-green-500/30",
  paused: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showForm, setShowForm] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaigns({
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        sort_by: sortBy,
        sort_order: sortBy ? sortOrder : undefined,
      });
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  function SortButton({ field, label }: { field: string; label: string }) {
    const isActive = sortBy === field;
    return (
      <button
        type="button"
        onClick={() => handleSort(field)}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-violet-500/15 text-violet-300"
            : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
        }`}
      >
        {label}
        {isActive && (
          <svg
            className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Campaigns</h1>
          <p className="mt-1 text-gray-400">Manage and track your marketing campaigns</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Campaign
        </button>
      </div>

      {/* Campaign form modal */}
      {showForm && (
        <CampaignForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchCampaigns();
          }}
        />
      )}

      {/* Filters and Sort Controls */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-400">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {capitalize(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-400">
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {capitalize(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-sm font-medium text-gray-400">Sort by</span>
          <SortButton field="budget" label="Budget" />
          <SortButton field="start_date" label="Start Date" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mt-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span className="ml-3 text-gray-400">Loading campaigns...</span>
        </div>
      ) : error ? (
        <div className="mt-12 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-300">{error}</p>
          <button
            type="button"
            onClick={fetchCampaigns}
            className="mt-3 text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Try again
          </button>
        </div>
      ) : campaigns.length === 0 ? (
        /* Empty state */
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/60">
            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">No campaigns yet</h3>
          <p className="mt-2 max-w-sm text-gray-400">
            Get started by creating your first marketing campaign to track and optimize your efforts.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Campaign
          </button>
        </div>
      ) : (
        /* Campaign cards grid */
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-200 hover:border-violet-500/40 hover:bg-gray-900/80"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors truncate pr-3">
                  {campaign.name}
                </h3>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[campaign.status] ?? STATUS_COLORS.draft}`}
                >
                  {capitalize(campaign.status)}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Budget</span>
                  <span className="font-medium text-white">{formatCurrency(campaign.budget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform</span>
                  <span className="text-gray-300">{capitalize(campaign.platform)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dates</span>
                  <span className="text-gray-300">
                    {formatDate(campaign.start_date)} – {formatDate(campaign.end_date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

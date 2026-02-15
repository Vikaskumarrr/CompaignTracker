"use client";

import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getStatusDistribution,
  getBudgetByCategory,
  getCampaignsOverTime,
} from "@/lib/api";
import type {
  DashboardSummary,
  StatusCount,
  CategoryBudget,
  TimeSeriesPoint,
} from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  draft: "#6b7280",
  active: "#22c55e",
  paused: "#eab308",
  completed: "#3b82f6",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [statusData, setStatusData] = useState<StatusCount[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBudget[]>([]);
  const [timeData, setTimeData] = useState<TimeSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, statusRes, categoryRes, timeRes] = await Promise.all([
          getDashboardSummary(),
          getStatusDistribution(),
          getBudgetByCategory(),
          getCampaignsOverTime(),
        ]);
        setSummary(summaryRes);
        setStatusData(statusRes);
        setCategoryData(categoryRes);
        setTimeData(timeRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <div className="mt-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span className="ml-3 text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <div className="mt-12 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Total Campaigns", value: summary?.total_campaigns ?? 0, format: (v: number) => v.toString() },
    { label: "Total Budget", value: summary?.total_budget ?? 0, format: formatCurrency },
    { label: "Active Campaigns", value: summary?.active_campaigns ?? 0, format: (v: number) => v.toString() },
    { label: "Average Budget", value: summary?.average_budget ?? 0, format: formatCurrency },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Campaign analytics and performance overview</p>
      </div>

      {/* Summary Metric Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm"
          >
            <p className="text-sm font-medium text-gray-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{metric.format(metric.value)}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Status Distribution Pie Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white">Status Distribution</h2>
          <p className="mt-1 text-sm text-gray-400">Campaigns grouped by status</p>
          {statusData.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/60">
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              </div>
              <p className="mt-3 text-sm text-gray-400">No status data available</p>
            </div>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="status"
                    paddingAngle={2}
                    label={({ name, value }: { name?: string; value?: number }) => `${capitalize(name ?? "")}: ${value ?? 0}`}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] ?? "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                    itemStyle={{ color: "#d1d5db" }}
                    formatter={(value?: number, name?: string) => [value ?? 0, capitalize(name ?? "")]}
                  />
                  <Legend
                    formatter={(value: string) => capitalize(value)}
                    wrapperStyle={{ color: "#9ca3af" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Budget by Category Bar Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-white">Budget by Category</h2>
          <p className="mt-1 text-sm text-gray-400">Total budget allocation per category</p>
          {categoryData.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/60">
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <p className="mt-3 text-sm text-gray-400">No category data available</p>
            </div>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={capitalize}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                    itemStyle={{ color: "#d1d5db" }}
                    formatter={(value?: number) => [formatCurrency(value ?? 0), "Budget"]}
                    labelFormatter={(label) => capitalize(String(label))}
                  />
                  <Bar dataKey="total_budget" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Campaigns Over Time Line Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Campaigns Over Time</h2>
          <p className="mt-1 text-sm text-gray-400">Number of campaigns created over time</p>
          {timeData.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/60">
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <p className="mt-3 text-sm text-gray-400">No timeline data available</p>
            </div>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    allowDecimals={false}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
                    itemStyle={{ color: "#d1d5db" }}
                    formatter={(value?: number) => [value ?? 0, "Campaigns"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#818cf8"
                    strokeWidth={2}
                    dot={{ fill: "#818cf8", r: 4 }}
                    activeDot={{ r: 6, fill: "#6366f1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createCampaign, updateCampaign } from "@/lib/api";
import type { Campaign, CampaignFormData } from "@/lib/types";

const STATUS_OPTIONS = ["draft", "active", "paused", "completed"] as const;
const PLATFORM_OPTIONS = [
  "facebook",
  "instagram",
  "twitter",
  "google",
  "linkedin",
  "email",
  "other",
] as const;
const CATEGORY_OPTIONS = [
  "brand_awareness",
  "lead_generation",
  "sales",
  "engagement",
  "retention",
  "other",
] as const;

interface CampaignFormProps {
  onClose: () => void;
  onSuccess: () => void;
  campaign?: Campaign;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function CampaignForm({ onClose, onSuccess, campaign }: CampaignFormProps) {
  const isEdit = Boolean(campaign);

  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    status: "draft",
    budget: 0,
    start_date: todayStr(),
    end_date: todayStr(),
    platform: "other",
    category: "other",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description ?? "",
        status: campaign.status,
        budget: campaign.budget,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        platform: campaign.platform,
        category: campaign.category,
      });
    }
  }, [campaign]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) {
      next.name = "Name is required";
    }
    if (formData.budget < 0) {
      next.budget = "Budget must be non-negative";
    }
    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      next.end_date = "End date must be on or after start date";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);
    try {
      if (isEdit && campaign) {
        await updateCampaign(campaign.id, formData);
      } else {
        await createCampaign(formData);
      }
      onSuccess();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "Edit Campaign" : "Create Campaign"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Campaign name"
              className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Campaign description (optional)"
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Status & Platform row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{capitalize(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="platform" className={labelClass}>Platform</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={inputClass}
              >
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>{capitalize(p)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Budget row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{capitalize(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget" className={labelClass}>Budget ($)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                className={`${inputClass} ${errors.budget ? "border-red-500" : ""}`}
              />
              {errors.budget && <p className={errorClass}>{errors.budget}</p>}
            </div>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className={labelClass}>Start Date</label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="end_date" className={labelClass}>End Date</label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className={`${inputClass} ${errors.end_date ? "border-red-500" : ""}`}
              />
              {errors.end_date && <p className={errorClass}>{errors.end_date}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isEdit ? "Update Campaign" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

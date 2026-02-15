"use client";

import { useEffect, useState, FormEvent } from "react";
import { getNews } from "@/lib/api";
import type { NewsArticle } from "@/lib/types";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateStr;
  }
}

function truncate(text: string | null, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + "…" : text;
}

export default function TrendsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  async function fetchArticles(kw?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getNews(kw || undefined);
      setArticles(data);
    } catch {
      setError("News service is temporarily unavailable. Please try again later.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = keyword.trim();
    setSearchedKeyword(trimmed);
    fetchArticles(trimmed);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Trends</h1>
        <p className="mt-1 text-gray-400">
          Trending news to help inform your campaign decisions
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search news by keyword…"
          className="flex-1 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          aria-label="Search news by keyword"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span className="ml-3 text-gray-400">Loading news…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-12 rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="mt-3 text-red-300">{error}</p>
          <button
            onClick={() => fetchArticles(searchedKeyword || undefined)}
            className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div className="mt-12 rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/60">
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          </div>
          <p className="mt-3 text-gray-400">
            {searchedKeyword
              ? `No articles found for "${searchedKeyword}"`
              : "No trending articles available right now"}
          </p>
        </div>
      )}

      {/* Articles grid */}
      {!loading && !error && articles.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <article
              key={`${article.url}-${idx}`}
              className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition-all hover:border-violet-500/40 hover:bg-gray-900/80"
            >
              <div className="flex-1">
                <h2 className="text-base font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    {truncate(article.description, 150)}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-violet-400">
                    {article.source}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatDate(article.published_at)}
                  </p>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 shrink-0 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-600/30"
                >
                  Read more
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { SupabaseClient } from "@supabase/supabase-js";

const FORMAT_OPTIONS = [
  { id: "twitter_thread", label: "Twitter/X Thread", icon: "𝕏" },
  { id: "linkedin_post", label: "LinkedIn Post", icon: "in" },
  { id: "email_newsletter", label: "Email Newsletter", icon: "✉" },
  { id: "instagram_caption", label: "Instagram Caption", icon: "📷" },
] as const;

type FormatId = (typeof FORMAT_OPTIONS)[number]["id"];

export default function DashboardPage() {
  const [content, setContent] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<FormatId[]>([
    "twitter_thread",
    "linkedin_post",
  ]);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<{
    used: number;
    limit: number | null;
    isPaid: boolean;
  } | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function getSupabase(): SupabaseClient {
    if (!supabaseRef.current) {
      supabaseRef.current = createSupabaseBrowser();
    }
    return supabaseRef.current!;
  }

  useEffect(() => {
    getSupabase()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setUserEmail(user.email || "");
      });
  }, []);

  function toggleFormat(id: FormatId) {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  async function handleRepurpose() {
    if (!content.trim()) {
      setError("Please paste some content first.");
      return;
    }
    if (!selectedFormats.length) {
      setError("Select at least one output format.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, formats: selectedFormats }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgrade) {
          setError(
            `Daily free limit reached (${data.limit} repurposes). Upgrade for unlimited access.`
          );
        } else {
          setError(data.error || "Something went wrong.");
        }
        return;
      }

      setResults(data.results);
      setUsage(data.usage);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(format: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  }

  async function handleSignOut() {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">
            ContentShift
          </Link>
          <div className="flex items-center gap-4">
            {usage && !usage.isPaid && (
              <Link
                href="/pricing"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {usage.limit! - usage.used} free left today — Upgrade
              </Link>
            )}
            {usage?.isPaid && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                Pro
              </span>
            )}
            <span className="text-sm text-slate-500">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Your content
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your blog post, article, transcript, or any long-form content here..."
              className="w-full h-64 px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-1 text-xs text-slate-400 text-right">
              {content.length.toLocaleString()} / 50,000 characters
            </div>

            <h3 className="text-sm font-semibold text-slate-900 mt-6 mb-3">
              Output formats
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => toggleFormat(format.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                    selectedFormats.includes(format.id)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-base">{format.icon}</span>
                  {format.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                {error}
                {error.includes("Upgrade") && (
                  <Link
                    href="/pricing"
                    className="block mt-2 font-medium text-blue-600 hover:text-blue-700"
                  >
                    View pricing plans →
                  </Link>
                )}
              </div>
            )}

            <button
              onClick={handleRepurpose}
              disabled={loading || !content.trim() || !selectedFormats.length}
              className="mt-6 w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Repurpose Content"}
            </button>
          </div>

          {/* Results Panel */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Results
            </h2>

            {loading && (
              <div className="flex items-center justify-center h-64 border border-slate-200 rounded-xl bg-white">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Generating content...
                  </p>
                </div>
              </div>
            )}

            {!loading && !results && (
              <div className="flex items-center justify-center h-64 border border-dashed border-slate-300 rounded-xl">
                <p className="text-sm text-slate-400">
                  Results will appear here
                </p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {Object.entries(results).map(([format, text]) => {
                  const formatInfo = FORMAT_OPTIONS.find(
                    (f) => f.id === format
                  );
                  return (
                    <div
                      key={format}
                      className="border border-slate-200 rounded-xl bg-white overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <span>{formatInfo?.icon}</span>
                          {formatInfo?.label}
                        </div>
                        <button
                          onClick={() => handleCopy(format, text)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          {copiedFormat === format ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap max-h-80 overflow-y-auto">
                        {text}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

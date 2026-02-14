"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const CATEGORIES = ["Technical", "Billing", "General", "Account", "Other"];

export function NewTicketForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || undefined;
    const priority = (formData.get("priority") as string) || "MEDIUM";
    const category = (formData.get("category") as string)?.trim() || undefined;

    if (!title) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, category }),
    });
    const data = await res.json().catch(() => ({}));

    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create ticket");
      return;
    }
    router.push(`/tickets/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Brief summary of the issue"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
          placeholder="Details, steps to reproduce, etc."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-zinc-300 mb-1">Priority</label>
          <select
            id="priority"
            name="priority"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
          <select
            id="category"
            name="category"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create ticket"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-600 px-4 py-2.5 font-medium text-zinc-300 hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

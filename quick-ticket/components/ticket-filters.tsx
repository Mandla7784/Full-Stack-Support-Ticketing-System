"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const STATUSES = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "WAITING", label: "Waiting" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const PRIORITIES = [
  { value: "", label: "All priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export function TicketFilters({
  status,
  priority,
  q,
}: { status: string; priority: string; q: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: { status?: string; priority?: string; q?: string }) => {
      const next = new URLSearchParams(searchParams.toString());
      if (updates.status !== undefined) (updates.status ? next.set("status", updates.status) : next.delete("status"));
      if (updates.priority !== undefined) (updates.priority ? next.set("priority", updates.priority) : next.delete("priority"));
      if (updates.q !== undefined) (updates.q ? next.set("q", updates.q) : next.delete("q"));
      router.push(`/tickets?${next.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setParams({ q: (fd.get("q") as string)?.trim() ?? "" }); }}
    >
      <input
        type="search"
        name="q"
        placeholder="Search…"
        defaultValue={q}
        className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
      />
      <button type="submit" className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-white hover:bg-zinc-600">Search</button>
      <select
        value={status}
        onChange={(e) => setParams({ status: e.target.value })}
        className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s.value || "all"} value={s.value}>{s.label}</option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => setParams({ priority: e.target.value })}
        className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value || "all"} value={p.value}>{p.label}</option>
        ))}
      </select>
    </form>
  );
}

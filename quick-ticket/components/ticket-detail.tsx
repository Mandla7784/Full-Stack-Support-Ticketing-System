"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
  OPEN: "bg-emerald-500/20 text-emerald-400",
  IN_PROGRESS: "bg-amber-500/20 text-amber-400",
  WAITING: "bg-sky-500/20 text-sky-400",
  RESOLVED: "bg-zinc-500/20 text-zinc-400",
  CLOSED: "bg-zinc-600/20 text-zinc-500",
};

const STATUSES = ["OPEN", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED"];

type UserSnap = { id: string; email: string; name: string | null };
type CommentSnap = { id: string; body: string; createdAt: Date; author: UserSnap };
type TicketSnap = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: UserSnap;
  assignedTo: UserSnap | null;
  comments: CommentSnap[];
};

function formatDate(d: Date) {
  return new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketDetail({ ticket: initial }: { ticket: TicketSnap }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initial);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(ticket.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  async function updateStatus(newStatus: string) {
    setUpdatingStatus(true);
    const res = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdatingStatus(false);
    if (res.ok) {
      setStatus(newStatus);
      setTicket((t) => ({ ...t, status: newStatus }));
      router.refresh();
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    const body = comment.trim();
    if (!body) return;
    setPostingComment(true);
    const res = await fetch(`/api/tickets/${ticket.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setPostingComment(false);
    setComment("");
    if (res.ok) {
      const data = await res.json();
      setTicket((t) => ({
        ...t,
        comments: [
          ...t.comments,
          {
            id: data.id,
            body: data.body,
            createdAt: data.createdAt,
            author: data.author,
          },
        ],
      }));
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">{ticket.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-zinc-400">
              <span>#{ticket.id.slice(-8)}</span>
              <span>•</span>
              <span>Created by {ticket.author.name ?? ticket.author.email}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
              {ticket.category && (
                <>
                  <span>•</span>
                  <span>{ticket.category}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[ticket.status] ?? "bg-zinc-500/20"}`}>
              {ticket.status.replace("_", " ")}
            </span>
            <span className="text-sm font-medium text-amber-400">{ticket.priority}</span>
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updatingStatus}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
        {ticket.description && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-zinc-300 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}
        {ticket.assignedTo && (
          <p className="mt-3 text-sm text-zinc-500">
            Assigned to {ticket.assignedTo.name ?? ticket.assignedTo.email}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-white mb-3">Comments ({ticket.comments.length})</h2>
        <ul className="space-y-3 mb-6">
          {ticket.comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4"
            >
              <p className="text-zinc-300 whitespace-pre-wrap">{c.body}</p>
              <p className="text-xs text-zinc-500 mt-2">
                {c.author.name ?? c.author.email} • {formatDate(c.createdAt)}
              </p>
            </li>
          ))}
        </ul>
        <form onSubmit={postComment} className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
          />
          <button
            type="submit"
            disabled={postingComment || !comment.trim()}
            className="self-start rounded-lg bg-amber-500 px-4 py-2 font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
          >
            {postingComment ? "Posting…" : "Post comment"}
          </button>
        </form>
      </div>
    </div>
  );
}

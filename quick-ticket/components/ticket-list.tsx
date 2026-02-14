import Link from "next/link";

type UserSnap = { id: string; email: string; name: string | null };
type TicketWithRelations = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  updatedAt: Date;
  author: UserSnap;
  assignedTo: UserSnap | null;
};

const statusColors: Record<string, string> = {
  OPEN: "bg-emerald-500/20 text-emerald-400",
  IN_PROGRESS: "bg-amber-500/20 text-amber-400",
  WAITING: "bg-sky-500/20 text-sky-400",
  RESOLVED: "bg-zinc-500/20 text-zinc-400",
  CLOSED: "bg-zinc-600/20 text-zinc-500",
};

const priorityColors: Record<string, string> = {
  LOW: "text-zinc-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-orange-400",
  URGENT: "text-red-400",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketList({
  tickets,
  total,
}: { tickets: TicketWithRelations[]; total: number }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-400">
        {total === 0 ? "No tickets yet. Create one to get started." : "No tickets match your filters."}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-400">{total} ticket{total !== 1 ? "s" : ""}</p>
      <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        {tickets.map((t) => (
          <li key={t.id}>
            <Link
              href={`/tickets/${t.id}`}
              className="block px-4 py-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-white truncate">{t.title}</h2>
                  {t.description && (
                    <p className="text-sm text-zinc-400 truncate mt-0.5">{t.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-zinc-500">
                    <span>By {t.author.name ?? t.author.email}</span>
                    {t.category && <span>• {t.category}</span>}
                    <span>• {formatDate(t.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[t.status] ?? "bg-zinc-500/20 text-zinc-400"}`}>
                    {t.status.replace("_", " ")}
                  </span>
                  <span className={`text-xs font-medium ${priorityColors[t.priority] ?? "text-zinc-400"}`}>
                    {t.priority}
                  </span>
                  {t.assignedTo && (
                    <span className="text-xs text-zinc-500">
                      → {t.assignedTo.name ?? t.assignedTo.email}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

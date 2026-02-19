import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { TicketList } from "@/components/ticket-list";
import { TicketFilters } from "@/components/ticket-filters";
import { FaTicketAlt } from "react-icons/fa";

type SearchParams = { status?: string; priority?: string; q?: string };

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status ?? "";
  const priority = params.priority ?? "";
  const q = (params.q ?? "").trim();

  const where: Prisma.TicketWhereInput = {};
  if (status) where.status = status as "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
  if (priority) where.priority = priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: {
        author: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.ticket.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <FaTicketAlt className="w-7 h-7 text-amber-400" />
          Support tickets
        </h1>
        <TicketFilters status={status} priority={priority} q={q} />
      </div>
      <TicketList tickets={tickets} total={total} />
    </div>
  );
}

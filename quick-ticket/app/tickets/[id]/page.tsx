import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-server";
import { TicketDetail } from "@/components/ticket-detail";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, email: true, name: true } },
      assignedTo: { select: { id: true, email: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, email: true, name: true } } },
      },
    },
  });

  if (!ticket) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/tickets"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to tickets
        </Link>
      </div>
      <TicketDetail ticket={ticket} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { TicketNav } from "@/components/ticket-nav";

export default async function TicketsLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/tickets");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <TicketNav user={session.user} />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-server";
import { NewTicketForm } from "@/components/new-ticket-form";

export default async function NewTicketPage() {
  await requireAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">New ticket</h1>
      <NewTicketForm />
    </div>
  );
}

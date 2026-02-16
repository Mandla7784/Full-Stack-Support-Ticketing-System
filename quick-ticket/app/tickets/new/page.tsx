import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-server";
import { NewTicketForm } from "@/components/new-ticket-form";
import { FaTicketAlt } from "react-icons/fa";

export default async function NewTicketPage() {
  await requireAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <FaTicketAlt className="w-7 h-7 text-amber-400" />
        New ticket
      </h1>
      <NewTicketForm />
    </div>
  );
}

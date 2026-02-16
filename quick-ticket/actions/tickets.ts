"use server";

import { getServerSession } from "next-auth";
import type { TicketPriority } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

function parsePriority(value: string | null): TicketPriority {
  switch (value) {
    case "LOW":
      return "LOW";
    case "HIGH":
      return "HIGH";
    case "URGENT":
      return "URGENT";
    case "MEDIUM":
      return "MEDIUM";
    default:
      return "MEDIUM";
  }
}

export type CreateTicketState = {
  error?: string;
  id?: string;
};

export async function createTicket(
  _prev: CreateTicketState | null,
  formData: FormData
): Promise<CreateTicketState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "You must be signed in to create a ticket." };
  }

  const title = (formData.get("title") as string)?.trim() ?? "";
  const description = (formData.get("description") as string)?.trim() || null;
  const priority = parsePriority(formData.get("priority") as string | null);
  const category = (formData.get("category") as string)?.trim() || null;

  if (!title) {
    return { error: "Title is required." };
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority as TicketPriority,
        category,
        authorId: session.user.id,
      },
    });
    return { id: ticket.id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create ticket. Try again." };
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: ticketId } = await params;
  const body = await req.json().catch(() => ({}));
  const bodyText = typeof body.body === "string" ? body.body.trim() : "";

  if (!bodyText) {
    return NextResponse.json({ error: "Comment body required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: bodyText,
      ticketId,
      authorId: session.user.id,
    },
    include: { author: { select: { id: true, email: true, name: true } } },
  });

  return NextResponse.json({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt,
    author: comment.author,
  });
}

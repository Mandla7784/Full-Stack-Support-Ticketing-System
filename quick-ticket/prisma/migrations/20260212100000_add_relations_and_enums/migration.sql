-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED');
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "UserRole" AS ENUM ('USER', 'AGENT', 'ADMIN');

-- Ensure we have a system user for ticket author default (idempotent)
INSERT INTO "users" ("id", "email", "password", "createdAt", "updatedAt")
VALUES ('clxxsystem00000000000000001', 'system@internal.local', '', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Add new columns to Ticket
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "authorId" TEXT DEFAULT 'clxxsystem00000000000000001';
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT;
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "statusNew" "TicketStatus" DEFAULT 'OPEN';
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "priorityNew" "TicketPriority" DEFAULT 'MEDIUM';

-- Migrate existing status/priority to enum
UPDATE "Ticket" SET "statusNew" = CASE
  WHEN "status" IN ('in_progress', 'IN_PROGRESS') THEN 'IN_PROGRESS'::"TicketStatus"
  WHEN "status" IN ('waiting', 'WAITING') THEN 'WAITING'::"TicketStatus"
  WHEN "status" IN ('resolved', 'RESOLVED') THEN 'RESOLVED'::"TicketStatus"
  WHEN "status" IN ('closed', 'CLOSED') THEN 'CLOSED'::"TicketStatus"
  ELSE 'OPEN'::"TicketStatus"
END;
UPDATE "Ticket" SET "priorityNew" = CASE
  WHEN "priority" IN ('low', 'LOW') THEN 'LOW'::"TicketPriority"
  WHEN "priority" IN ('high', 'HIGH') THEN 'HIGH'::"TicketPriority"
  WHEN "priority" IN ('urgent', 'URGENT') THEN 'URGENT'::"TicketPriority"
  ELSE 'MEDIUM'::"TicketPriority"
END;

ALTER TABLE "Ticket" DROP COLUMN IF EXISTS "status";
ALTER TABLE "Ticket" DROP COLUMN IF EXISTS "priority";
ALTER TABLE "Ticket" RENAME COLUMN "statusNew" TO "status";
ALTER TABLE "Ticket" RENAME COLUMN "priorityNew" TO "priority";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Ticket" ALTER COLUMN "priority" SET NOT NULL;
ALTER TABLE "Ticket" ALTER COLUMN "authorId" DROP DEFAULT;

-- Add name and role to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable Comment
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");
CREATE INDEX "Ticket_authorId_idx" ON "Ticket"("authorId");
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");
CREATE INDEX "Comment_ticketId_idx" ON "Comment"("ticketId");

ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

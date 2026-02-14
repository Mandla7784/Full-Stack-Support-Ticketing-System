"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function TicketNav({ user }: { user: { email?: string | null; name?: string | null } }) {
  const pathname = usePathname();
  const base = "/tickets";

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            href={base}
            className={`font-medium ${pathname === base ? "text-amber-400" : "text-zinc-300 hover:text-white"}`}
          >
            Tickets
          </Link>
          <Link
            href={`${base}/new`}
            className={`font-medium ${pathname === `${base}/new` ? "text-amber-400" : "text-zinc-300 hover:text-white"}`}
          >
            New ticket
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 truncate max-w-[180px]">
            {user.name ?? user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

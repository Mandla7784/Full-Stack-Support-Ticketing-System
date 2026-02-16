declare module "next-auth/react" {
  export function signIn(
    provider?: string,
    options?: { redirect?: boolean; callbackUrl?: string } & Record<string, unknown>
  ): Promise<{ url?: string; error?: string; status?: number } | undefined>;

  export function signOut(options?: { callbackUrl?: string }): Promise<void>;

  export function useSession(): {
    data: { user?: { name?: string; email?: string; image?: string }; expires?: string } | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };

  export function SessionProvider(props: {
    children: React.ReactNode;
    session?: unknown;
  }): React.ReactElement;
}

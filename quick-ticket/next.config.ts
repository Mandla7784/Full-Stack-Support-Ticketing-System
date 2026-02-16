import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
};

// Only wrap with Sentry in production when SENTRY_DSN is set (avoids dev startup / module resolution issues)
let config: NextConfig = nextConfig;
if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
  try {
    const { withSentryConfig } = require("@sentry/nextjs");
    config = withSentryConfig(nextConfig, {
      org: "mandla-zy",
      project: "quick-ticket",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      webpack: {
        automaticVercelMonitors: true,
        treeshake: { removeDebugLogging: true },
      },
    });
  } catch {
    config = nextConfig;
  }
}

export default config;

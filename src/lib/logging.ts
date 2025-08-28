export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  sessionId?: string;
  [key: string]: unknown;
}

function detectEnv(): "development" | "production" {
  try {
    if (typeof window !== "undefined") {
      const host = window.location?.hostname ?? "";
      return host === "localhost" || host === "127.0.0.1" ? "development" : "production";
    }
  } catch (_) {}
  return "production";
}

export function logStructured(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    level,
    message,
    ts: Date.now(),
    env: detectEnv(),
    ...context,
  };

  const text = JSON.stringify(payload);
  switch (level) {
    case "debug":
      if (payload.env !== "production") console.debug(text);
      break;
    case "info":
      console.info(text);
      break;
    case "warn":
      console.warn(text);
      break;
    case "error":
      console.error(text);
      break;
  }
}
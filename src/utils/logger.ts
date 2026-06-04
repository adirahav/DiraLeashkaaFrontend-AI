const MAX_ENTRIES = 500;
const TAG_PATTERN = /^\[([A-Z0-9-]+)\]\s*(.*)/s;

export interface LogEntry {
  id: string;
  tag: string;
  message: string;
  timestamp: string;
  raw: string;
  page: string;
}

type Subscriber = (entries: LogEntry[]) => void;

const logs: LogEntry[] = [];
const subscribers = new Set<Subscriber>();
let originalConsoleLog: typeof console.log;

function timestamp(): string {
  return new Date().toTimeString().slice(0, 8);
}

function notify() {
  const snapshot = [...logs];
  subscribers.forEach((cb) => cb(snapshot));
}

function intercept(...args: unknown[]): void {
  const first = args[0];

  if (typeof first === "string") {
    const match = TAG_PATTERN.exec(first);
    if (match) {
      const [, tag, messagePart] = match;
      const extras = args
        .slice(1)
        .map((a) => {
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(" ");

      const message = extras ? `${messagePart} ${extras}` : messagePart;
      const raw = extras ? `[${tag}] ${message}` : first;

      const entry: LogEntry = {
        id: crypto.randomUUID(),
        tag,
        message,
        timestamp: timestamp(),
        raw,
        page: typeof window !== "undefined" ? window.location.pathname : "",
      };

      logs.push(entry);
      if (logs.length > MAX_ENTRIES) logs.shift();
      notify();

      originalConsoleLog.apply(console, args);
      return;
    }
  }

  // Untagged — pass through silently (no storage)
  originalConsoleLog.apply(console, args);
}

export const logger = {
  init() {
    if (originalConsoleLog) return;
    originalConsoleLog = console.log.bind(console);
    console.log = intercept;
  },

  getLogs(): LogEntry[] {
    return [...logs];
  },

  clear() {
    logs.length = 0;
    notify();
  },

  subscribe(cb: Subscriber): () => void {
    subscribers.add(cb);
    return () => subscribers.delete(cb);
  },

  getAvailableTags(): string[] {
    return [...new Set(logs.map((e) => e.tag))].sort();
  },
};

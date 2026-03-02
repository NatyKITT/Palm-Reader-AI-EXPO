const requests = new Map<string, {count: number; resetAt: number}>();

const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000;

export async function isRateLimited(ip: string): Promise<boolean> {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, {count: 1, resetAt: now + WINDOW_MS});
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

import {RateLimiterMemory} from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 5, // 5 requestů
  duration: 60, // za minutu
});

export async function isRateLimited(ip: string): Promise<boolean> {
  try {
    await limiter.consume(ip);
    return false;
  } catch {
    return true;
  }
}
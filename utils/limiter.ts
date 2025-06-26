// utils/limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests/minute
});

// app/api/generate/route.ts
export async function checkRateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await limiter.limit(ip);
  if (!success) return new Response("Rate limited", { status: 429 });
  return null;
}
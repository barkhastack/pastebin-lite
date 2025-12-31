import { createClient } from "redis";

const redis = createClient({
  url: process.env.UPSTASH_REDIS_REDIS_URL,
});

redis.connect();

export async function GET() {
  try {
    await redis.ping();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

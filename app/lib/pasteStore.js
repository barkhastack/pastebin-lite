import { createClient } from "redis";

let redis;
let connected = false;

async function getRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.UPSTASH_REDIS_REDIS_URL,
    });

    redis.on("error", (err) => console.error("Redis error", err));
  }

  if (!connected) {
    await redis.connect();
    connected = true;
  }

  return redis;
}

export async function savePaste(id, paste) {
  const r = await getRedis();
  await r.set(`paste:${id}`, JSON.stringify(paste));
}

export async function getPaste(id) {
  const r = await getRedis();
  const value = await r.get(`paste:${id}`);
  return value ? JSON.parse(value) : null;
}

export async function deletePaste(id) {
  const r = await getRedis();
  await r.del(`paste:${id}`);
}

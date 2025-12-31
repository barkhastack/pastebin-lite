import { createClient } from "redis";

const redis = createClient({
  url: process.env.UPSTASH_REDIS_REDIS_URL,
});

redis.connect();

export async function savePaste(id, data) {
  await redis.set(`paste:${id}`, JSON.stringify(data));
}

export async function getPaste(id) {
  const value = await redis.get(`paste:${id}`);
  return value ? JSON.parse(value) : null;
}

export async function deletePaste(id) {
  await redis.del(`paste:${id}`);
}

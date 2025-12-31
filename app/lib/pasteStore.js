import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function savePaste(id, data) {
  await redis.set(`paste:${id}`, JSON.stringify(data));
}

export async function getPaste(id) {
  const data = await redis.get(`paste:${id}`);
  return data ? JSON.parse(data) : null;
}

export async function deletePaste(id) {
  await redis.del(`paste:${id}`);
}

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function savePaste(id, data) {
  await redis.set(`paste:${id}`, data);
}

export async function getPaste(id) {
  return await redis.get(`paste:${id}`);
}

export async function deletePaste(id) {
  await redis.del(`paste:${id}`);
}

import { createClient } from "redis";

let redis;
let isConnected = false;

async function getRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.UPSTASH_REDIS_REDIS_URL,
    });

    redis.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
  }

  if (!isConnected) {
    await redis.connect();
    isConnected = true;
  }

  return redis;
}

export async function savePaste(id, data) {
  const client = await getRedis();
  await client.set(`paste:${id}`, JSON.stringify(data));
}

export async function getPaste(id) {
  const client = await getRedis();
  const value = await client.get(`paste:${id}`);
  return value ? JSON.parse(value) : null;
}

export async function deletePaste(id) {
  const client = await getRedis();
  await client.del(`paste:${id}`);
}

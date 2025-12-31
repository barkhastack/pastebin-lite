import { kv } from "@vercel/kv";

export async function savePaste(id, data) {
  await kv.set(`paste:${id}`, data);
}

export async function getPaste(id) {
  return await kv.get(`paste:${id}`);
}

export async function deletePaste(id) {
  await kv.del(`paste:${id}`);
}

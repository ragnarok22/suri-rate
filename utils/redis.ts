import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

export async function getRedisClient() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

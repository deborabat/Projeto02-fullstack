const { createClient } = require("redis");

const publisher = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

publisher.on("error", (err) =>
  console.error("[resource-service] Erro Redis:", err.message),
);

async function connectRedis() {
  await publisher.connect();
  console.log("[resource-service] Redis conectado!");
}

async function publishEvent(event, data) {
  const payload = JSON.stringify({ event, data, timestamp: new Date() });
  await publisher.publish("biblioteca:eventos", payload);
  console.log(`[resource-service] Evento publicado: ${event}`);
}

const CACHE_TTL = 60;

async function getCache(key) {
  const data = await publisher.get(key);
  return data ? JSON.parse(data) : null;
}

async function setCache(key, value) {
  await publisher.set(key, JSON.stringify(value), { EX: CACHE_TTL });
}

async function invalidateBookCache() {
  const keys = await publisher.keys("books:*");
  if (keys.length > 0) {
    await publisher.del(keys);
    console.log(`[resource-service] Cache invalidado (${keys.length} chave(s))`);
  }
}

module.exports = { connectRedis, publishEvent, getCache, setCache, invalidateBookCache };

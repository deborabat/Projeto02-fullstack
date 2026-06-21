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

// publica evento na fila
async function publishEvent(event, data) {
  const payload = JSON.stringify({ event, data, timestamp: new Date() });
  await publisher.publish("biblioteca:eventos", payload);
  console.log(`[resource-service] Evento publicado: ${event}`);
}

module.exports = { connectRedis, publishEvent };

const { createClient } = require("redis");

const subscriber = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

subscriber.on("error", (err) =>
  console.error("[notification-service] Erro Redis:", err.message),
);

async function connectRedis() {
  await subscriber.connect();
  console.log("[notification-service] Redis conectado!");
}

module.exports = { subscriber, connectRedis };

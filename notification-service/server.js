const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { connectRedis, subscriber } = require("./src/config/redis");
const { addClient, broadcast } = require("./src/models/wsManager");
const healthRoutes = require("./src/routes/healthRoutes");

const app = express();
app.use(express.json());
app.use(healthRoutes);

// cria servidor HTTP compartilhado com WebSocket
const server = http.createServer(app);

// servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  addClient(ws);
});

const PORT = process.env.PORT || 3003;

// inicia tudo
connectRedis().then(() => {
  // assina o canal do Redis e retransmite via WebSocket
  subscriber.subscribe("biblioteca:eventos", (message) => {
    try {
      const payload = JSON.parse(message);
      console.log(`[notification-service] Evento recebido: ${payload.event}`);
      broadcast(payload);
    } catch (err) {
      console.error(
        "[notification-service] Erro ao processar mensagem:",
        err.message,
      );
    }
  });

  server.listen(PORT, () => {
    console.log(`[notification-service] rodando na porta ${PORT}`);
    console.log(
      `[notification-service] WebSocket aguardando conexões em ws://localhost:${PORT}`,
    );
  });
});

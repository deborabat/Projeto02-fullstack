const clients = new Set();

// registra nova conexão WebSocket
function addClient(ws) {
  clients.add(ws);
  console.log(
    `[notification-service] Cliente conectado. Total: ${clients.size}`,
  );

  ws.on("close", () => {
    clients.delete(ws);
    console.log(
      `[notification-service] Cliente desconectado. Total: ${clients.size}`,
    );
  });
}

// envia mensagem para todos os clientes conectados
function broadcast(message) {
  const payload = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === 1) {
      // 1 = OPEN
      client.send(payload);
    }
  });
  console.log(
    `[notification-service] Broadcast para ${clients.size} cliente(s): ${message.event}`,
  );
}

module.exports = { addClient, broadcast };

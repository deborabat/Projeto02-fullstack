const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10, // pool de conexões
    });
    console.log("[auth-service] MongoDB conectado!");
  } catch (error) {
    console.error("[auth-service] Erro ao conectar MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

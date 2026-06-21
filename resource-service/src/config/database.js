const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
    });
    console.log("[resource-service] MongoDB conectado!");
  } catch (error) {
    console.error("[resource-service] Erro MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

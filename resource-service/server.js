require("dotenv").config();
const express = require("express");
const compression = require("compression");
const connectDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");
const bookRoutes = require("./src/routes/bookRoutes");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(compression());
app.use(express.json());

app.use("/books", bookRoutes);

app.get("/health", (req, res) =>
  res.json({ service: "resource-service", status: "ok" }),
);

const PORT = process.env.PORT || 3002;

Promise.all([connectDB(), connectRedis()]).then(() => {
  app.listen(PORT, () => {
    console.log(`[resource-service] rodando na porta ${PORT}`);
  });
});

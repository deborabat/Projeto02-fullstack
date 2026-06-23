const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");
const bookRoutes = require("./src/routes/bookRoutes");
const cors = require("cors");

// Express 5 torna req.query somente-leitura; sanitizamos apenas body e params
function sanitize(req, _res, next) {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
}

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(compression());
app.use(express.json());
app.use(sanitize);

app.use("/books", bookRoutes);

app.get("/health", (req, res) =>
  res.json({ service: "resource-service", status: "ok" }),
);

const PORT = process.env.PORT || 3002;

Promise.all([connectDB(), connectRedis()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[resource-service] rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[resource-service] Falha na inicialização:", err.message);
    process.exit(1);
  });

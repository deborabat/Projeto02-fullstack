const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

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

app.use("/auth", authRoutes);

app.get("/health", (req, res) =>
  res.json({ service: "auth-service", status: "ok" }),
);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[auth-service] rodando na porta ${PORT}`);
  });
});

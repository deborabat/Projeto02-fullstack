require("dotenv").config();
const express = require("express");
const compression = require("compression");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(compression());
app.use(express.json());

app.use("/auth", authRoutes);

// health-check
app.get("/health", (req, res) =>
  res.json({ service: "auth-service", status: "ok" }),
);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[auth-service] rodando na porta ${PORT}`);
  });
});

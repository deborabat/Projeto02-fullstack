require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(compression());
app.use(express.json());

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

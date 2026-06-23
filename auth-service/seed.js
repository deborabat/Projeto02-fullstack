require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./src/models/User");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await User.deleteMany({});

  const usuarios = [
    {
      nome: "Debora",
      email: "debora@email.com",
      password: await bcrypt.hash("123456", 10),
    },
    {
      nome: "Ana",
      email: "ana@email.com",
      password: await bcrypt.hash("123456", 10),
    },
  ];

  await User.insertMany(usuarios);
  console.log("Usuários criados com sucesso!");
  process.exit(0);
}

seed();

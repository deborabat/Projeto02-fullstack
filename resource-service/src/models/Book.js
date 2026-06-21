const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true,
    },
    autor: {
      type: String,
      required: [true, "Autor é obrigatório"],
      trim: true,
    },
    subject: {
      type: String,
      default: "Literatura",
      trim: true,
    },
    first_publish_year: {
      type: Number,
    },
    cover_url: {
      type: String,
      default: null,
    },
    // vínculo com o usuário criador
    proprietario: {
      type: String,
      required: true,
    },
    proprietarioNome: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);

const { Router } = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const Book = require("../models/Book");
const { publishEvent } = require("../config/redis");

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(limiter);

// ── MIDDLEWARE de autenticação ────────────────────────────────
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const resposta = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/auth/verify`,
      {},
      { headers: { authorization: authHeader } },
    );

    req.user = resposta.data.user;
    next();
  } catch (error) {
    console.error("[resource-service] Token inválido:", error.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

// ── GET /books — listar todos ─────────────────────────────────
router.get("/", authenticate, async (req, res) => {
  try {
    const { q, autor } = req.query;
    let filtro = {};

    if (q) {
      filtro.$or = [
        { titulo: { $regex: q, $options: "i" } },
        { autor: { $regex: q, $options: "i" } },
      ];
    }
    if (autor) {
      filtro.autor = { $regex: autor, $options: "i" };
    }

    const books = await Book.find(filtro).sort({ createdAt: -1 });
    console.log(`[resource-service] Busca realizada por ${req.user.email}`);
    return res.status(200).json(books);
  } catch (error) {
    console.error("[resource-service] Erro na busca:", error.message);
    return res.status(500).json({ error: "Erro interno" });
  }
});

// ── GET /books/:id — buscar por ID ───────────────────────────
router.get("/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livro não encontrado" });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({ error: "ID inválido" });
  }
});

// ── POST /books — criar ───────────────────────────────────────
router.post("/", authenticate, async (req, res) => {
  try {
    const { titulo, autor, subject, first_publish_year, cover_url } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ error: "Título e autor são obrigatórios" });
    }

    const book = await Book.create({
      titulo: titulo.trim(),
      autor: autor.trim(),
      subject: subject?.trim() ?? "Literatura",
      first_publish_year,
      cover_url: cover_url ?? null,
      proprietario: req.user.id,
      proprietarioNome: req.user.nome,
    });

    await publishEvent("livro.criado", { book, usuario: req.user.email });
    console.log(
      `[resource-service] Livro criado por ${req.user.email}: ${titulo}`,
    );
    return res
      .status(201)
      .json({ message: "Livro cadastrado com sucesso", book });
  } catch (error) {
    console.error("[resource-service] Erro ao criar:", error.message);
    return res.status(500).json({ error: "Erro interno" });
  }
});

// ── PUT /books/:id — atualizar ────────────────────────────────
router.put("/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livro não encontrado" });

    // verificação de proprietário
    if (book.proprietario !== req.user.id) {
      console.log(
        `[resource-service] Acesso negado: ${req.user.email} tentou editar livro de outro usuário`,
      );
      return res
        .status(403)
        .json({ error: "Você não tem permissão para editar este livro" });
    }

    const { titulo, autor, subject, first_publish_year, cover_url } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ error: "Título e autor são obrigatórios" });
    }

    const atualizado = await Book.findByIdAndUpdate(
      req.params.id,
      {
        titulo: titulo.trim(),
        autor: autor.trim(),
        subject,
        first_publish_year,
        cover_url,
      },
      { new: true, runValidators: true },
    );

    await publishEvent("livro.atualizado", {
      book: atualizado,
      usuario: req.user.email,
    });
    console.log(
      `[resource-service] Livro atualizado por ${req.user.email}: ${titulo}`,
    );
    return res
      .status(200)
      .json({ message: "Livro atualizado com sucesso", book: atualizado });
  } catch (error) {
    console.error("[resource-service] Erro ao atualizar:", error.message);
    return res.status(500).json({ error: "Erro interno" });
  }
});

// ── DELETE /books/:id — excluir ───────────────────────────────
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Livro não encontrado" });

    // verificação de proprietário
    if (book.proprietario !== req.user.id) {
      console.log(
        `[resource-service] Acesso negado: ${req.user.email} tentou excluir livro de outro usuário`,
      );
      return res
        .status(403)
        .json({ error: "Você não tem permissão para excluir este livro" });
    }

    await Book.findByIdAndDelete(req.params.id);
    await publishEvent("livro.excluido", {
      bookId: req.params.id,
      usuario: req.user.email,
    });
    console.log(`[resource-service] Livro excluído por ${req.user.email}`);
    return res.status(200).json({ message: "Livro excluído com sucesso" });
  } catch (error) {
    console.error("[resource-service] Erro ao excluir:", error.message);
    return res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;

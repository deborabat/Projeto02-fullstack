const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const router = Router();

// rate limiting — máximo 10 tentativas de login por 15 min por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas. Tente novamente em 15 minutos." },
});

// ── POST /auth/login ──────────────────────────────────────────
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(
        `[auth-service] Login falhou: usuário não encontrado — ${email}`,
      );
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      console.log(`[auth-service] Login falhou: senha incorreta — ${email}`);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    console.log(`[auth-service] Login bem-sucedido — ${email}`);
    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: { id: user._id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    console.error("[auth-service] Erro no login:", error.message);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ── POST /auth/logout ─────────────────────────────────────────
router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    // verifica se o token é válido antes de revogar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // adiciona o token à lista de revogados do usuário
    await User.findByIdAndUpdate(decoded.id, {
      $push: { revokedTokens: token },
    });

    console.log(`[auth-service] Logout — ${decoded.email}`);
    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

// ── POST /auth/verify ─────────────────────────────────────────
// usado pelo resource-service para validar o JWT
router.post("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // verifica se o token foi revogado
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (user.revokedTokens.includes(token)) {
      return res.status(401).json({ error: "Token revogado" });
    }

    return res.status(200).json({
      valid: true,
      user: { id: user._id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
});

module.exports = router;

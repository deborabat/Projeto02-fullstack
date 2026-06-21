const { Router } = require("express");
const router = Router();

router.get("/health", (req, res) => {
  res.json({ service: "notification-service", status: "ok" });
});

module.exports = router;

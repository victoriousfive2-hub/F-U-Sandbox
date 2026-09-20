import express from "express";

const app = express();

app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 10000;
const SECRET = process.env.SANDBOX_SECRET;

function authenticate(req, res, next) {
  if (!SECRET) {
    return res.status(503).json({
      error: "SANDBOX_SECRET_NOT_CONFIGURED"
    });
  }

  const auth = req.headers.authorization || "";

  if (auth !== `Bearer ${SECRET}`) {
    return res.status(401).json({
      error: "UNAUTHORIZED"
    });
  }

  next();
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "F-U-Sandbox"
  });
});

app.get("/v1/status", authenticate, (_req, res) => {
  res.json({
    status: "ready",
    service: "F-U-Sandbox"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`F-U-Sandbox listening on port ${PORT}`);
});

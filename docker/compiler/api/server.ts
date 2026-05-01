import { fileURLToPath } from "node:url";
import express from "express";
import { cargoMidenVersion } from "@/lib/cargo-miden.js";
import { compile } from "@/lib/compile.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

app.get("/", async (req, res) => {
  res.json({
    timestamp: Date.now(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
    cargoMidenVersion: await cargoMidenVersion(),
  });
});

app.post("/compile", async (req, res) => {
  const { files, entrypoint } = req.body as {
    files?: Record<string, string>;
    entrypoint?: string;
  };
  if (!files || typeof files !== "object") {
    res.status(400).json({ error: "Missing files object" });
    return;
  }
  const cargoTomlPath = entrypoint ? `${entrypoint}/Cargo.toml` : "Cargo.toml";
  if (!files[cargoTomlPath]) {
    res.status(400).json({ error: "Missing Cargo.toml" });
    return;
  }
  try {
    const { stdout, stderr, masp, digest, manifest } = await compile({
      files,
      entrypoint,
    });
    res.json({ stdout, stderr, masp, digest, manifest });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Compilation failed";
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

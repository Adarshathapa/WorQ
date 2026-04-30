import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route for remove.bg
  app.post("/api/remove-bg", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const apiKey = process.env.REMOVE_BG_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "REMOVE_BG_API_KEY is not configured" });
      }

      const formData = new FormData();
      formData.append("size", "auto");
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("image_file", blob, req.file.originalname);

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData as any,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Remove.bg API error:", response.status, errText);
        return res.status(response.status).json({ error: "Failed to remove background from remove.bg. Check API Key or limits." });
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader("Content-Type", "image/png");
      res.send(buffer);
    } catch (error: any) {
      console.error("Remove.bg error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

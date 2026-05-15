import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import { compressImage, compressPdf, compressOfficeDoc, CompressionSettings } from "./src/lib/compressionEngine";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for compression
  app.post("/api/compress", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      let settings: CompressionSettings;
      try {
        settings = typeof req.body.settings === "string" ? JSON.parse(req.body.settings) : (req.body.settings || {});
      } catch (e) {
        settings = { mode: "auto", strength: "balanced" };
      }
      
      const mimetype = req.file.mimetype;
      const originalName = req.file.originalname.toLowerCase();
      
      let compressedBuffer: Buffer;

      if (mimetype.startsWith("image/") || originalName.match(/\.(jpg|jpeg|png|webp)$/)) {
        compressedBuffer = await compressImage(req.file.buffer, settings, mimetype);
      } else if (mimetype === "application/pdf" || originalName.endsWith(".pdf")) {
        compressedBuffer = await compressPdf(req.file.buffer, settings);
      } else if (originalName.match(/\.(docx|pptx|xlsx)$/)) {
        compressedBuffer = await compressOfficeDoc(req.file.buffer, settings);
      } else {
        return res.status(400).json({ error: "Unsupported file type for compression" });
      }

      res.setHeader("Content-Type", mimetype);
      res.setHeader("Content-Disposition", `attachment; filename="compressed_${req.file.originalname}"`);
      res.send(compressedBuffer);
    } catch (error: any) {
      console.error("Compression error:", error);
      res.status(500).json({ error: error.message || "Failed to compress file" });
    }
  });

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
    const fs = require('fs');
    app.use(express.static(distPath, { index: false })); // Don't serve index.html directly
    
    const indexHtmlPath = path.join(distPath, "index.html");
    
    app.get("*", (req, res) => {
      try {
        let html = fs.readFileSync(indexHtmlPath, 'utf8');
        let title = "Free PDF Tools Online – Merge, Compress & Convert PDFs | WorQ-AI";
        let description = "Use free AI-powered PDF tools to merge, compress, split, convert and edit PDFs online. Fast, secure and no signup required.";
        
        // Basic static routing for SEO injection
        if (req.path.includes('/merge-pdf')) {
          title = "Merge PDF Online Free – Manage PDF Files | WorQ-AI";
          description = "Combine multiple PDF documents into a single file easily and securely.";
        } else if (req.path.includes('/compress-pdf')) {
          title = "Compress PDF Online Free – Manage PDF Files | WorQ-AI";
          description = "Reduce PDF file size without losing quality. Free online PDF compressor.";
        } else if (req.path.includes('/pdf-to-word')) {
          title = "PDF to Word Converter Online Free | WorQ-AI";
          description = "Convert your PDF files to editable Word documents instantly.";
        } else if (req.path.includes('/word-to-pdf')) {
          title = "Word to PDF Converter Online Free | WorQ-AI";
          description = "Convert Word documents (DOCX, DOC) to PDF format securely.";
        } else if (req.path.includes('/split-pdf')) {
          title = "Split PDF Online Free – Manage PDF Files | WorQ-AI";
          description = "Extract pages or split a PDF into multiple files effortlessly.";
        }

        // Replace default meta tags
        html = html.replace(/<title>.*?<\/title>/g, `<title>${title}</title>`);
        html = html.replace(/<meta name="description".*?>/g, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta property="og:title".*?>/g, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta property="og:description".*?>/g, `<meta property="og:description" content="${description}" />`);
        
        res.send(html);
      } catch (e) {
        res.sendFile(indexHtmlPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

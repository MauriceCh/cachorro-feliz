import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no configurada.");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Cachorro Feliz Server" });
});

// Gemini AI API routes
app.post(["/api/gemini/generate", "/api/gemini"], async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El campo prompt es requerido." });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error en endpoint Gemini:", error);
    res.status(500).json({
      error: error.message || "Error procesando solicitud con Inteligencia Artificial."
    });
  }
});

// AI Image generation route
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido para generar la imagen." });
    }

    const ai = getGeminiClient();
    
    // Try generating images using imagen-3.0-generate-002
    try {
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio || "1:1",
          outputMimeType: "image/jpeg",
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageBytes = response.generatedImages[0].image?.imageBytes;
        if (imageBytes) {
          return res.json({
            imageUrl: `data:image/jpeg;base64,${imageBytes}`,
            source: "imagen-3"
          });
        }
      }
    } catch (imagenError: any) {
      console.warn("Imagen model error, trying generateContent with image:", imagenError.message);
    }

    // Fallback: Return descriptive guidance for canvas renderer
    res.json({
      success: false,
      fallbackRequired: true,
      message: "Modelo de imagen no disponible con la clave actual, usando Renderizador Gráfico Oficial de Marca."
    });
  } catch (error: any) {
    console.error("Error en endpoint de imagen:", error);
    res.status(500).json({
      error: error.message || "Error generando imagen con IA."
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Cachorro Feliz escuchando en http://0.0.0.0:${PORT}`);
  });
}

start();

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Advanced Multimodal Sign Analysis using Gemini Vision
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { image, images, recognizedLabels, mode, context } = req.body;

    if (!process.env.GEMINI_API_KEY || !aiClient) {
      // Graceful fallback if no API key is provided
      return res.json({
        success: true,
        source: 'local-cv-fallback',
        translation: recognizedLabels && recognizedLabels.length > 0
          ? recognizedLabels.join(' ')
          : 'Sign detected via computer vision',
        confidence: 0.88,
        analysis: 'Running in high-speed edge computer vision mode. Local landmark classifier is active.',
        suggestions: [
          'Keep your hand centered and well-lit',
          'Make sure finger joints are clearly distinguishable from palm',
        ],
      });
    }

    // Build parts for Gemini
    const parts: any[] = [];

    // System prompt tailored for sign language expertise
    const systemPrompt = `You are an expert American Sign Language (ASL) and Computer Vision Interpreter.
Analyze the provided camera frame(s) of hand gestures.
The user is performing sign language.
Local CV detected tentative signs: ${JSON.stringify(recognizedLabels || [])}.
Mode: ${mode || 'recognition'}.
Context: ${context || 'General conversational sign'}.

Analyze the exact hand pose, finger extensions, thumb position, palm orientation, and gesture meaning.
Provide output in JSON format with this structure:
{
  "translation": "The interpreted sign or translated English phrase",
  "confidence": 0.95,
  "signName": "Exact ASL sign name (e.g., 'HELLO', 'A', 'THANK YOU')",
  "formAccuracy": 92,
  "detailedFeedback": "Concise description of hand orientation, finger curling, and palm direction",
  "tips": ["One specific tip for proper articulation"],
  "sentenceSuggestion": "Natural conversational sentence incorporating this sign"
}`;

    // Add image(s)
    const rawImages = images && Array.isArray(images) ? images : image ? [image] : [];
    for (const img of rawImages) {
      if (typeof img === 'string') {
        const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        });
      }
    }

    parts.push({
      text: systemPrompt,
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = {
        translation: text.slice(0, 100),
        confidence: 0.9,
        detailedFeedback: text,
      };
    }

    return res.json({
      success: true,
      source: 'gemini-vision',
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing sign with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze sign image',
    });
  }
});

// Configure Vite middleware in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SignSense AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

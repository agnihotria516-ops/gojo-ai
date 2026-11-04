const express = require("express");
const path = require("path");

const app = express();
// Enable CORS for Android APK
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(API_KEY), model: MODEL });
});

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      error: "The server has no Gemini API key. Set GEMINI_API_KEY in your environment and restart the server."
    });
  }
  const incoming = req.body && Array.isArray(req.body.messages) ? req.body.messages : [];
  const messages = incoming.slice(-16);
  if (!messages.length || messages.some(m =>
    !m || !["user", "assistant"].includes(m.role) ||
    typeof m.content !== "string" || m.content.length > 2000
  )) {
    return res.status(400).json({ error: "Please send a valid text message." });
  }

  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const payload = {
    system_instruction: {
      parts: [{
        text: "You are a friendly, witty, supportive anime-inspired conversational character based on the fictional Gojo Satoru from Jujutsu Kaisen. Speak with playful confidence and occasional light anime references, but do not claim to literally be the copyrighted character or mislead users about being human. Answer questions accurately and clearly, explain school topics step by step, and keep responses age-appropriate. Never provide dangerous instructions. Do not invent facts; say when you are unsure."
      }]
    },
    contents,
    generationConfig: { temperature: 0.8, maxOutputTokens: 700 }
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const detail = data.error && data.error.message ? data.error.message : `Gemini API returned HTTP ${upstream.status}`;
      return res.status(upstream.status === 429 ? 429 : 502).json({ error: detail });
    }
    const reply = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || "")
      .join("")
      .trim();
    if (!reply) return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
    res.json({ reply });
  } catch (error) {
    const message = error.name === "TimeoutError"
      ? "The AI request timed out. Check your connection and retry."
      : "Could not reach Gemini. Check the server internet connection.";
    res.status(502).json({ error: message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Gojo AI is running at http://localhost:${PORT}`);
  console.log(`Gemini API key configured: ${Boolean(API_KEY)}`);
});

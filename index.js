const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ⚠️ WARNING: public repo তে API KEY রাখিস না
const API_KEY = "AIzaSyA3qvd_Jg9-CQ4mIMpwEKbzlQ9C-fCeiBs";

// health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Gemini API",
    uptime: process.uptime()
  });
});

// ✅ Gemini endpoint
app.get("/gemini", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "query missing" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: q }]
          }
        ]
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({ error: "No reply from Gemini" });
    }

    res.json({
      reply
    });

  } catch (err) {
    res.status(500).json({
      error: "Gemini API failed",
      message: err.response?.data || err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

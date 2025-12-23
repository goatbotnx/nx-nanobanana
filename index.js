require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.NANOBANANA_API_KEY;

if (!API_KEY) {
  console.error("❌ NANOBANANA_API_KEY missing");
}

// health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Nanobanana API",
    uptime: process.uptime()
  });
});

// example api route
app.get("/nanobanana", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "query missing" });

    const response = await axios.get(
      "https://nx-nanobanana-api.com/search",
      {
        params: { q },
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "API failed",
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

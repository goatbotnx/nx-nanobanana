app.get("/gemini", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "query missing" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA3qvd_Jg9-CQ4mIMpwEKbzlQ9C-fCeiBs`,
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

    res.json({ reply });

  } catch (err) {
    res.status(500).json({
      error: "Gemini API failed",
      message: err.response?.data || err.message
    });
  }
});

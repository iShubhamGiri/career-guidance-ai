const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const axiosRetry = require("axios-retry");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Check for required API key
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ Missing OPENROUTER_API_KEY in environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// 🔁 Retry configuration
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`🔁 Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 429,
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;
  console.log("📨 Received:", message);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "referer": "https://ishubhamgiri.github.io/career-guidance-ai/",
          "X-Title": "Career Guidance AI",
        },
        timeout: 15000, // ⏱ Timeout after 15 seconds
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || "OpenRouter API failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

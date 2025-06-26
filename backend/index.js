const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Career Guidance AI Backend is Live!");
});

app.post("/ask", async (req, res) => {
  const userInput = req.body.message;

  // Placeholder for AI logic (e.g., OpenAI call)
  res.json({
    reply: `Thanks for your message: "${userInput}". (AI reply goes here...)`
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static("frontend")); 
// Ensure your backend and frontend directories are siblings

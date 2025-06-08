// api-humanize.js

const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// Use my test OpenAI key for now — you'll replace this later
const configuration = new Configuration({
  apiKey: "sk-...your-real-api-key-here...", // replace with your own later
});

const openai = new OpenAIApi(configuration);

app.post("/humanize", async (req, res) => {
  const userText = req.body.text;

  try {
    const chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Rewrite this text to sound more human, natural, and original. Avoid robotic or AI-sounding language.",
        },
        {
          role: "user",
          content: userText,
        },
      ],
    });

    const humanizedText = chat.data.choices[0].message.content;
    res.json({ result: humanizedText });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with OpenAI." });
  }
});

// If running locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

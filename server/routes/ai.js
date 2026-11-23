
import express from "express";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url))
});

const router = express.Router();

const providers = {
  openrouter: {
    key: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  },
  nvidia: {
    key: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
  }
};

router.get("/models/:provider", async (req, res) => {
  try {
    const provider = providers[req.params.provider];

    if (!provider) {
      return res.status(400).json({ error: "Unsupported AI provider" });
    }

    if (!provider.key) {
      return res.status(400).json({
        error: `${req.params.provider} API key is missing on the server`
      });
    }

    const response = await fetch(`${provider.baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${provider.key}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Could not fetch models"
      });
    }

    const models = (data.data || []).map((model) => ({
      id: model.id,
      name: model.name || model.id
    }));

    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/chat", async (req, res) => {
  try {
    const { provider: providerName, model, messages } = req.body;
    const provider = providers[providerName];

    if (!provider) {
      return res.status(400).json({
        error: "Unsupported AI provider"
      });
    }

    if (!provider.key) {
      return res.status(400).json({
        error: `${providerName} API key is missing on the server`
      });
    }

    if (!model || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please select a model and enter a message"
      });
    }

    const requestBody = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    };

    // Disable reasoning for Nemotron 3.5 Lightning
    if (
      providerName === "nvidia" &&
      model === "nvidia/nemotron-3.5-lightning-30b-a3b"
    ) {
      requestBody.chat_template_kwargs = {
        enable_thinking: false
      };
    }

    const response = await fetch(
      `${provider.baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    const choice = data.choices?.[0];

    const reply = choice?.message?.content;

    if (!reply || !reply.trim()) {
      return res.status(502).json({
        error: `Empty AI response. Finish reason: ${choice?.finish_reason || "unknown"}`
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
});


export default router;

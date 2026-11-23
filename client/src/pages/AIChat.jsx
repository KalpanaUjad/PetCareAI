
import { useEffect, useState } from "react";
import { Bot, Send, RefreshCw, User } from "lucide-react";

export default function AIChat() {
  const [provider, setProvider] = useState("openrouter");
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState("");

  const suggestedModels = models.filter((item) =>
  /instruct|nemotron|llama|gpt-4o-mini/i.test(item.id)
).slice(0, 5);

  const fetchModels = async (selectedProvider = provider) => {
    setLoadingModels(true);
    setError("");
    setModels([]);
    setModel("");

    try {
      const response = await fetch(`/api/ai/models/${selectedProvider}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load models");
      }

      const availableModels = data.models || [];
      setModels(availableModels);

      if (availableModels.length > 0) {
        // Prefer a commonly used model when it exists in the live catalogue.
        const preferred = availableModels.find((item) =>
          /llama|nemotron|gpt-4o-mini/i.test(item.id)
        );

        setModel((preferred || availableModels[0]).id);
      } else {
        setError("No models were returned by this provider.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels(provider);
  }, [provider]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const prompt = message.trim();
    if (!prompt || !model || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: prompt }
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model,
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setError(err.message);
      // Keep the user's message visible so they can retry.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="page-heading">
        <div>
          <h1>AI Pet Care Assistant</h1>
          <p>Ask questions about general pet care and wellbeing.</p>
        </div>
      </div>

      <div className="ai-controls">
        <label>
          AI Provider
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setMessages([]);
            }}
          >
            <option value="openrouter">OpenRouter</option>
            <option value="nvidia">NVIDIA</option>
          </select>
        </label>

        <label>
          Select Model
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={loadingModels || models.length === 0}
          >
            {models.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.id})
              </option>
            ))}
          </select>
        </label>

        {suggestedModels.length > 0 && (
  <div className="suggested-models">
    <p>Suggested Models</p>

    {suggestedModels.map((item) => (
      <button
        key={item.id}
        type="button"
        className={model === item.id ? "suggested-active" : ""}
        onClick={() => setModel(item.id)}
      >
        {item.name || item.id}
      </button>
    ))}
  </div>
)}

        <button
          type="button"
          className="secondary-btn"
          onClick={() => fetchModels()}
          disabled={loadingModels}
        >
          <RefreshCw size={16} />
          {loadingModels ? "Loading..." : "Refresh Models"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <Bot size={42} />
              <h3>Hello! I'm your Pet Care Assistant.</h3>
              <p>Ask me a general question about pet care.</p>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              className={`chat-message ${item.role}`}
              key={index}
            >
              <span className="chat-avatar">
                {item.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </span>
              <p>{item.content}</p>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">
              <span className="chat-avatar"><Bot size={18} /></span>
              <p>Thinking...</p>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something about pet care..."
            disabled={loading || !model}
          />
          <button type="submit" disabled={loading || !model || !message.trim()}>
            <Send size={18} />
            Send
          </button>
        </form>
      </div>

      <p className="ai-disclaimer">
        AI responses are for general information only. They are not a
        substitute for advice from a qualified veterinarian.
      </p>
    </div>
  );
}

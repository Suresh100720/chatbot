import { Settings } from "llamaindex";
import { Ollama, OllamaEmbedding } from "@llamaindex/ollama";
import { OpenAI, OpenAIEmbedding } from "@llamaindex/openai";
import { Anthropic } from "@llamaindex/anthropic";

export function initLLM() {
  const llmProvider = process.env.LLM_PROVIDER?.toLowerCase() || "ollama";

  // Configure LLM
  if (llmProvider === "openrouter") {
    Settings.llm = new OpenAI({
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct:free",
      apiKey: process.env.OPENROUTER_API_KEY,
      additionalSessionOptions: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });
  } else if (llmProvider === "openai") {
    Settings.llm = new OpenAI({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else if (llmProvider === "anthropic" || llmProvider === "claude") {
    Settings.llm = new Anthropic({
      model: process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307",
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  } else {
    // Default to Ollama
    Settings.llm = new Ollama({ model: process.env.OLLAMA_MODEL || "llama3" });
  }

  // Configure Embedding Model (Anthropic/OpenRouter don't provide standard embeddings usually, so default to OpenAI or Ollama)
  const embedProvider = process.env.EMBED_PROVIDER?.toLowerCase() || "ollama";
  if (embedProvider === "openai") {
    Settings.embedModel = new OpenAIEmbedding({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    // Default to local embeddings
    Settings.embedModel = new OllamaEmbedding({ model: "nomic-embed-text" });
  }
}

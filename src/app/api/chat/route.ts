import { NextResponse } from "next/server";
import {
  VectorStoreIndex,
  Settings,
  storageContextFromDefaults
} from "llamaindex";
import { initLLM } from "../../../lib/llm";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const { message, mode, chatId } = await req.json();

    if (!message || !chatId) {
      return NextResponse.json({ error: "Message and chatId are required" }, { status: 400 });
    }

    // Initialize Settings dynamically based on .env
    initLLM();

    const storageDir = join(process.cwd(), "storage", chatId);
    let hasDocument = false;
    try {
      const fs = require("fs");
      if (fs.existsSync(storageDir)) {
        hasDocument = true;
      }
    } catch (e) {}

    let SYSTEM_PROMPT = "";

    if (mode === "cv_summarizer" && message === "EXTRACT_CV_SUMMARY") {
      SYSTEM_PROMPT = `You are an AI recruitment assistant. Your ONLY output must be a raw JSON object. Do not wrap it in markdown. Do not add conversational text.
If the document is not a traditional CV, extract any relevant details you can find.
Return a JSON object with type "cv_summary":
{
  "type": "cv_summary",
  "data": {
    "name": "Candidate Name or Document Title",
    "skills": ["skill1", "skill2"],
    "summary": "Professional summary or document overview.",
    "experience": "Total years or brief experience overview."
  }
}`;
    } else if (mode === "jd_generator") {
      SYSTEM_PROMPT = `You are an AI recruitment assistant. Your ONLY output must be a raw JSON object. Do not wrap it in markdown. Do not add conversational text.
Return a JSON object with type "job_description":
{
  "type": "job_description",
  "data": {
    "title": "Job Title",
    "skills": ["skill1", "skill2"],
    "description": "A compelling 2-paragraph job description.",
    "experience": "Required experience."
  }
}`;
    } else if (hasDocument) {
      SYSTEM_PROMPT = `You are an AI recruitment assistant. Answer the user's questions STRICTLY based on the provided document context in plain text. DO NOT generate job descriptions. If the information is not in the document, say "I cannot find this information in the document."`;
    } else {
      SYSTEM_PROMPT = `You are an AI recruitment assistant. Answer the user's questions in a helpful, professional manner in plain text.`;
    }

    const fullMessage = `${SYSTEM_PROMPT}\n\nUser Input:\n${message}`;

    let responseStream: any;

    try {
      if (hasDocument) {
        // Load and query the document index
        const storageContext = await storageContextFromDefaults({ persistDir: storageDir });
        const index = await VectorStoreIndex.init({ storageContext });
        
        // Query the index with optimized RAG retrieval
        const retriever = index.asRetriever({ similarityTopK: 6 });
        const queryEngine = index.asQueryEngine({ retriever });
        responseStream = await queryEngine.query({ query: fullMessage, stream: true });
      } else {
        // Throw a manual error to trigger the fallback to standard LLM chat
        throw new Error("Bypass index");
      }
    } catch (e: any) {
      // Fallback: Just chat with the base LLM without any document context
      responseStream = await Settings.llm.chat({
        messages: [{ role: "user", content: fullMessage }],
        stream: true
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            let text = "";
            if (typeof chunk === "string") text = chunk;
            else if (chunk.message?.content) text = chunk.message.content;
            else if (chunk.delta) text = chunk.delta;
            else if (chunk.response) text = chunk.response;

            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

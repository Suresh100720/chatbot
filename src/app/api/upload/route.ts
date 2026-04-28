import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { 
  VectorStoreIndex, 
  Settings, 
  storageContextFromDefaults
} from "llamaindex";
import { initLLM } from "../../../lib/llm";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const chatId: string = data.get("chatId") as string;

    if (!file || !chatId) {
      return NextResponse.json({ success: false, error: "File and chatId are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Isolate data and storage per chat
    const dataDir = join(process.cwd(), "data", chatId);
    const storageDir = join(process.cwd(), "storage", chatId);
    try {
      const { rm } = require("fs/promises");
      await rm(dataDir, { recursive: true, force: true });
      await rm(storageDir, { recursive: true, force: true });
    } catch (e) {}

    await mkdir(dataDir, { recursive: true });
    
    const filePath = join(dataDir, file.name);
    await writeFile(filePath, buffer);

    // Initialize Settings dynamically based on .env
    initLLM();

    // Load document using LlamaIndex
    const reader = new SimpleDirectoryReader();
    const documents = await reader.loadData({ directoryPath: dataDir });

    // Create Index and persist
    const storageContext = await storageContextFromDefaults({ persistDir: storageDir });
    
    // Add Chunking Strategy (SentenceSplitter)
    Settings.chunkSize = 512;
    Settings.chunkOverlap = 50;

    await VectorStoreIndex.fromDocuments(documents, { storageContext });

    return NextResponse.json({ success: true, message: "Document uploaded and indexed successfully!" });
  } catch (error: any) {
    console.error("Error in upload:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

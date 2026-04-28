# 🚀 AI Recruitment Suite

## 📌 Overview

**AI Recruitment Suite** is a full-stack AI-powered application designed to streamline recruitment workflows using **local AI (offline-first architecture)**.

It enables recruiters to:

* 📄 Summarize CVs instantly
* 💼 Generate professional job descriptions
* 💬 Chat with documents or ask general queries

The system is built using:

* **Ollama (Local LLM)**
* **LlamaIndex (RAG framework)**
* **Vector Database (local storage)**
* **Next.js (ChatGPT-like UI)**

👉 All processing happens **locally**, ensuring **privacy, speed, and zero API cost**.

---

# 🧠 Core AI Modules

## 📄 1. CV Summarizer Mode

* Upload CV files (`PDF`, `TXT`, `MD`, `CSV`)
* Automatically:

  * Parses document
  * Extracts structured data
  * Generates a **Summary Card UI**

### 🔹 Output Includes:

* Candidate Name
* Key Skills
* Experience
* Summary

### 💬 Interactive Q&A

* Ask follow-up questions:

  > “Does the candidate have React experience?”

👉 AI answers **strictly based on uploaded CV (RAG)**

---

## 💼 2. Job Description (JD) Generator

* Dedicated form-based input:

  * Job Title
  * Skills
  * Experience

### ⚡ Output:

* Professional **2-paragraph job description**
* Rendered as a **clean UI card**

---

## 💬 3. Normal Chat Mode

* ChatGPT-style assistant
* Supports:

  * Recruitment queries
  * Coding help
  * General questions

---

# ⚙️ Advanced Technical Features

## 🔍 Universal Document Analysis (RAG)

* Upload document in any mode
* System automatically:

  * Switches to RAG mode
  * Uses document context

👉 If no document:

* Falls back to normal LLM chat

---

## 🧠 Strict Per-Chat Memory Isolation

* Each chat session gets:

  * Separate vector database
  * Separate document storage

👉 Prevents:

* Data leakage
* Context mixing

---

## 🔐 100% Local & Private Processing

* Powered by:

  * Ollama (LLM)
  * LlamaIndex (RAG)

✔ No external API required
✔ No data leaves your machine

---

## ⚡ Real-Time Streaming & Interruptions

* Responses stream like ChatGPT (typewriter effect)
* Users can:

  * Interrupt ongoing responses
  * Ask new questions instantly

---

## 📱 Responsive Mobile-First UI

* Fully responsive layout
* Sidebar navigation
* Clean chat interface

---

# 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* Next.js API Routes

### AI / RAG

* Ollama (Local LLM)
* LlamaIndex
* Local Vector Database

---

# 📁 Project Structure

```text
local-search-engine/
├── .env.local                  # Environment variables (LLM_PROVIDER, OLLAMA_MODEL, etc.)
├── next.config.mjs             # Next.js configuration settings
├── package.json                # Dependencies (Next.js, LlamaIndex, Tailwind, etc.)
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
│
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main UI page
│   │   │
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts    # Streams AI responses + queries vector DB
│   │       │
│   │       └── upload/
│   │           └── route.ts    # Handles file upload & indexing
│   │
│   ├── components/
│   │   ├── ChatMessages.tsx        # Chat message UI
│   │   ├── CvSummarizerInput.tsx  # CV upload input
│   │   ├── JdGeneratorInput.tsx   # JD form UI
│   │   ├── NormalChatInput.tsx    # Chat input
│   │   ├── Sidebar.tsx            # Navigation + history
│   │   └── SummaryCard.tsx        # Structured output UI
│   │
│   ├── lib/
│   │   └── llm.ts                # LLM + embedding configuration
│   │
│   └── types/
│       └── chat.ts              # Type definitions
│
├── data/
│   └── [chatId]/                # Uploaded files per chat session
│
└── storage/
    └── [chatId]/                # Vector DB per chat session
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd local-search-engine
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Install & Run Ollama

```bash
ollama pull llama3
ollama run llama3
```

---

## 4️⃣ Start Application

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🔑 Environment Configuration

Create `.env.local`:

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3
```

---

# 🔄 System Workflow

```text
User Input (Chat / Upload / Form)
        ↓
Next.js API (/chat or /upload)
        ↓
LlamaIndex (RAG Processing)
        ↓
Vector DB (per chat session)
        ↓
Ollama (LLM)
        ↓
Streaming Response
        ↓
UI Rendering (Chat + Cards)
```

---

# 🧠 Prompt Engineering

* **System Prompts** → Define recruiter role
* **Context Injection** → Inject document chunks
* **Strict JSON Output** → Enables UI card rendering

---

# 🎯 Key Highlights

✔ Fully local AI system (no APIs required)
✔ RAG-based document intelligence
✔ Per-chat memory isolation
✔ Real-time streaming responses
✔ ChatGPT-like responsive UI
✔ Multi-mode workflow (CV, JD, Chat)

---

# 🚀 Future Enhancements

* Integrate **Chroma / FAISS** (advanced vector DB)
* Add **authentication & user accounts**
* Improve **Auto-RAG ranking**
* Deploy using **Docker**

---

# 🏆 Conclusion

AI Recruitment Suite demonstrates a **complete AI-driven recruitment workflow** using:

* Local LLM (Ollama)
* Retrieval-Augmented Generation (LlamaIndex)
* Next.js UI

👉 Delivering a **secure, scalable, and offline AI application**

---

## 👨‍💻 Author

Suresh

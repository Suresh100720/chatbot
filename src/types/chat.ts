export type Message = { role: "user" | "ai"; text: string };
export type AppMode = "cv_summarizer" | "jd_generator" | "normal_chat";
export type ChatSession = { id: string; title: string; messages: Message[]; mode: AppMode };

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, Paperclip, MessageSquarePlus, MessageSquare, Briefcase, FileText, MessageCircle, Menu } from "lucide-react";

import { AppMode, ChatSession } from "../types/chat";
import { Sidebar } from "../components/Sidebar";
import { ChatMessages } from "../components/ChatMessages";
import { CvSummarizerInput } from "../components/CvSummarizerInput";
import { JdGeneratorInput } from "../components/JdGeneratorInput";
import { NormalChatInput } from "../components/NormalChatInput";

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>("cv_summarizer");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = chatHistory.find(c => c.id === currentChatId);
  const messages = activeChat?.messages || [];
  
  useEffect(() => {
    if (activeChat && activeChat.mode !== appMode) {
      setAppMode(activeChat.mode);
    }
  }, [activeChat]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory, isLoaded]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    let currentId = currentChatId;
    if (!currentId || activeChat?.mode !== appMode) {
      currentId = Date.now().toString();
      setCurrentChatId(currentId);
      setChatHistory(prev => [{ id: currentId, title: "Document Analysis", mode: appMode, messages: [] }, ...prev]);
    }
    formData.append("chatId", currentId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (appMode === "cv_summarizer") {
          await sendRequest(currentId, `EXTRACT_CV_SUMMARY:${file.name}`, "cv_summarizer");
        } else {
          // Just silently acknowledge the upload for other modes
          setChatHistory(prev => prev.map(c => c.id === currentId ? { 
            ...c, 
            messages: [
              ...c.messages, 
              { role: "user", text: `📎 Uploaded Document: ${file.name}` },
              { role: "ai", text: "Document successfully uploaded. I am ready to answer questions based on this document." }
            ] 
          } : c));
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleGenerateJD = async (jobTitle: string, skills: string, experience: string) => {
    const userMessage = `Job Title: ${jobTitle}\nSkills: ${skills}\nExperience: ${experience}`;
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      setCurrentChatId(chatId);
      const title = jobTitle.substring(0, 30) || "Job Description";
      setChatHistory(prev => [{ id: chatId, title, mode: "jd_generator", messages: [] }, ...prev]);
    }
    await sendRequest(chatId, userMessage, "jd_generator");
  };
  
  const handleAskChat = async (input: string) => {
    const userMessage = input;
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      setCurrentChatId(chatId);
      const title = userMessage.substring(0, 30) || "New Chat";
      setChatHistory(prev => [{ id: chatId, title, mode: appMode, messages: [] }, ...prev]);
    }
    await sendRequest(chatId, userMessage, appMode);
  };

  const sendRequest = async (chatId: string, userMessage: string, mode: AppMode) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    
    const isCvExtract = userMessage.startsWith("EXTRACT_CV_SUMMARY");
    const filename = isCvExtract ? userMessage.split(":")[1] || "Document" : null;
    const actualApiMessage = isCvExtract ? "EXTRACT_CV_SUMMARY" : userMessage;

    const displayMessage = isCvExtract 
      ? `📎 Uploaded Document: ${filename}\n\nPlease extract the CV summary.` 
      : userMessage;

    setChatHistory(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { role: "user", text: displayMessage }] } : c));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: actualApiMessage, mode, chatId }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        let errStr = "Error occurred";
        try { const errData = await res.json(); errStr = errData.error || errStr; } catch (e) {}
        throw new Error(errStr);
      }

      if (!res.body) throw new Error("No response body");

      setLoading(false);
      setChatHistory(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { role: "ai", text: "" }] } : c));
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiResponseText += chunk;
        
        setChatHistory(prev => prev.map(c => {
          if (c.id === chatId) {
            const newMessages = [...c.messages];
            newMessages[newMessages.length - 1] = { role: "ai", text: aiResponseText };
            return { ...c, messages: newMessages };
          }
          return c;
        }));
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setChatHistory(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { role: "ai", text: "Error: " + err.message }] } : c));
      setLoading(false);
    }
  };

  const handleNewChat = (mode: AppMode) => {
    setAppMode(mode);
    setCurrentChatId("");
    setSidebarOpen(false);
  };

  const loadChat = (chat: ChatSession) => {
    setCurrentChatId(chat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) setCurrentChatId("");
  };
  
  const filteredHistory = chatHistory.filter(c => c.mode === appMode);

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100 font-sans overflow-hidden">
      <Sidebar 
        appMode={appMode} 
        handleNewChat={handleNewChat} 
        filteredHistory={filteredHistory} 
        currentChatId={currentChatId} 
        loadChat={loadChat} 
        deleteChat={deleteChat} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-[#171717] border-b border-white/10 z-10 sticky top-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-2 font-bold capitalize text-lg text-white">
            {appMode.replace('_', ' ')}
          </h1>
        </div>

        <ChatMessages 
          messages={messages} 
          appMode={appMode} 
          loading={loading} 
          messagesEndRef={messagesEndRef} 
        />

        <div className="p-4 md:p-6 w-full max-w-4xl mx-auto">
          {appMode === "jd_generator" && (
            <JdGeneratorInput 
              onGenerate={handleGenerateJD} 
              loading={loading} 
              onUpload={handleUpload} 
              uploading={uploading} 
              fileInputRef={fileInputRef} 
            />
          )}

          {appMode === "cv_summarizer" && (
            <CvSummarizerInput 
              onSend={handleAskChat} 
              onUpload={handleUpload} 
              loading={loading} 
              uploading={uploading} 
              fileInputRef={fileInputRef} 
            />
          )}

          {appMode === "normal_chat" && (
            <NormalChatInput 
              onSend={handleAskChat} 
              loading={loading}
              onUpload={handleUpload} 
              uploading={uploading} 
              fileInputRef={fileInputRef}
            />
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden" 
            accept=".txt,.pdf,.md,.csv" 
          />

          <div className="text-center text-xs text-gray-500 mt-3">
            Offline Mode Active. Data processed locally.
          </div>
        </div>
      </div>
    </div>
  );
}

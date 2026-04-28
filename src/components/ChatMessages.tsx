import { Bot, Loader2, FileText, Briefcase, MessageCircle } from "lucide-react";
import { Message, AppMode } from "../types/chat";
import { SummaryCard } from "./SummaryCard";

type Props = {
  messages: Message[];
  appMode: AppMode;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

export const ChatMessages = ({ messages, appMode, loading, messagesEndRef }: Props) => {
  const renderAiMessage = (text: string) => {
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const parsed = JSON.parse(jsonStr);
      if (parsed.type) {
        return <SummaryCard parsed={parsed} />;
      }
    } catch (e) {
      // normal text
    }
    return <p className="whitespace-pre-wrap leading-relaxed m-0">{text}</p>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center mt-32">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              {appMode === "cv_summarizer" && <FileText className="w-10 h-10 text-emerald-500" />}
              {appMode === "jd_generator" && <Briefcase className="w-10 h-10 text-blue-500" />}
              {appMode === "normal_chat" && <MessageCircle className="w-10 h-10 text-purple-500" />}
            </div>
            <h3 className="text-3xl font-bold mb-3 text-white capitalize">{appMode.replace('_', ' ')}</h3>
            <p className="text-gray-400 max-w-md">
              {appMode === "cv_summarizer" && "Upload a candidate's CV to extract a structured summary, then ask any follow-up questions."}
              {appMode === "jd_generator" && "Enter Job details below to instantly generate a professional Job Description."}
              {appMode === "normal_chat" && "Ask me anything! I am your AI recruitment assistant."}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                  ${appMode === 'cv_summarizer' ? 'bg-emerald-600' : appMode === 'jd_generator' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gray-700 text-white px-5 py-3' 
                  : 'text-gray-200 w-full'
              }`}>
                {msg.role === 'ai' ? renderAiMessage(msg.text) : <p className="whitespace-pre-wrap leading-relaxed m-0">{msg.text}</p>}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
               ${appMode === 'cv_summarizer' ? 'bg-emerald-600' : appMode === 'jd_generator' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-5 py-3 text-gray-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> Processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

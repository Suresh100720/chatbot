import { FileText, Briefcase, MessageCircle, MessageSquare, X } from "lucide-react";
import { AppMode, ChatSession } from "../types/chat";

type Props = {
  appMode: AppMode;
  handleNewChat: (mode: AppMode) => void;
  filteredHistory: ChatSession[];
  currentChatId: string;
  loadChat: (chat: ChatSession) => void;
  deleteChat: (e: React.MouseEvent, id: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
};

export const Sidebar = ({ appMode, handleNewChat, filteredHistory, currentChatId, loadChat, deleteChat, isOpen, setIsOpen }: Props) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen?.(false)} 
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#171717] flex flex-col border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 space-y-2 mt-2 md:mt-0">
          <div className="flex justify-between items-center md:hidden mb-4 px-2 text-white">
            <span className="font-bold">Menu</span>
            <button onClick={() => setIsOpen?.(false)} className="p-1 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        <button 
          onClick={() => handleNewChat("cv_summarizer")}
          className={`flex items-center justify-start gap-3 w-full py-3 px-4 transition rounded-lg text-sm font-semibold shadow-md
            ${appMode === "cv_summarizer" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20" : "bg-[#2f2f2f] hover:bg-white/10"}`}
        >
          <FileText className="w-4 h-4" />
          CV Summarizer
        </button>
        <button 
          onClick={() => handleNewChat("jd_generator")}
          className={`flex items-center justify-start gap-3 w-full py-3 px-4 transition rounded-lg text-sm font-semibold shadow-md
            ${appMode === "jd_generator" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20" : "bg-[#2f2f2f] hover:bg-white/10"}`}
        >
          <Briefcase className="w-4 h-4" />
          JD Generator
        </button>
        <button 
          onClick={() => handleNewChat("normal_chat")}
          className={`flex items-center justify-start gap-3 w-full py-3 px-4 transition rounded-lg text-sm font-semibold shadow-md
            ${appMode === "normal_chat" ? "bg-purple-600 hover:bg-purple-500 shadow-purple-900/20" : "bg-[#2f2f2f] hover:bg-white/10"}`}
        >
          <MessageCircle className="w-4 h-4" />
          Normal Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-2">
        <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">History ({appMode.replace('_', ' ')})</p>
        <div className="flex flex-col gap-2">
          {filteredHistory.length === 0 ? (
            <p className="text-sm text-gray-500 italic px-2">No records found</p>
          ) : (
            filteredHistory.map((chat) => (
              <div key={chat.id} className="relative group">
                <button 
                  onClick={() => loadChat(chat)}
                  className={`flex items-center justify-start gap-3 w-full py-2 px-3 pr-8 hover:bg-white/5 transition rounded-lg text-sm text-left ${currentChatId === chat.id ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
                <button 
                  onClick={(e) => deleteChat(e, chat.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition text-gray-500"
                  title="Delete Record"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 text-xs text-gray-500 border-t border-white/10 text-center">
        AI Recruitment Suite
      </div>
    </div>
    </>
  );
};

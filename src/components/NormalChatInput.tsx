import { Send, Paperclip, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export const NormalChatInput = ({ onSend, loading, onUpload, uploading, fileInputRef }: Props) => {
  const [input, setInput] = useState("");

  const handleAskChat = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bg-[#2f2f2f] rounded-2xl p-2 pl-4 flex items-center shadow-xl border border-white/5">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || loading}
        className="text-gray-400 hover:text-white transition disabled:opacity-50 mr-2 bg-white/5 p-2 rounded-full hover:bg-purple-600"
        title="Upload Document"
      >
        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
      </button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAskChat()}
        placeholder="Type your message..."
        className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none py-3 text-sm"
      />
      
      <button
        onClick={handleAskChat}
        disabled={loading || !input.trim()}
        className="text-white p-3 rounded-xl shadow-lg transition disabled:opacity-50 ml-2 bg-purple-600 hover:bg-purple-500"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

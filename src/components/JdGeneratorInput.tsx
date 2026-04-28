import { Send, Paperclip, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  onGenerate: (jobTitle: string, skills: string, experience: string) => void;
  loading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export const JdGeneratorInput = ({ onGenerate, loading, onUpload, uploading, fileInputRef }: Props) => {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const handleAskJD = () => {
    if (!jobTitle.trim() && !skills.trim() && !experience.trim()) return;
    onGenerate(jobTitle, skills, experience);
    setJobTitle("");
    setSkills("");
    setExperience("");
  };

  return (
    <div className="bg-[#2f2f2f] rounded-2xl p-4 shadow-xl border border-white/5 relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
          className="text-gray-400 hover:text-white transition disabled:opacity-50 p-2 rounded-full hover:bg-white/10"
          title="Upload Context Document"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 mt-4">
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job Title (e.g. Software Engineer)"
          className="w-full bg-[#1e1e1e] border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition text-sm"
        />
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Required Skills (e.g. React, Node.js)"
          className="w-full bg-[#1e1e1e] border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition text-sm"
        />
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Experience (e.g. 5+ years)"
          className="w-full bg-[#1e1e1e] border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition text-sm"
        />
      </div>
      <button
        onClick={handleAskJD}
        disabled={loading || (!jobTitle && !skills && !experience)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-xl py-3 hover:bg-blue-500 transition disabled:opacity-50"
      >
        <Send className="w-4 h-4" /> Generate Job Description
      </button>
    </div>
  );
};

import { Briefcase } from "lucide-react";

export const SummaryCard = ({ parsed }: { parsed: any }) => {
  if (!parsed || !parsed.data) return null;
  const { data, type } = parsed;
  
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl w-full my-2">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-5 h-5 text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          {type === "cv_summary" ? "CV Summary" : "Job Description"}
        </span>
      </div>
      <h4 className="text-xl font-bold mb-2 text-white">{data.name || data.title || "Profile / Job"}</h4>
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{data.summary || data.description}</p>
      {data.skills && data.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, i: number) => (
            <span key={i} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      )}
      {data.experience && (
        <div className="mt-4 pt-3 border-t border-white/10 text-sm text-gray-400">
          <span className="font-semibold text-gray-300">Experience:</span> {data.experience}
        </div>
      )}
    </div>
  );
};

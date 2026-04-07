"use client";

interface SoWhatQuestionListProps {
  questions: string[];
}

export default function SoWhatQuestionList({
  questions,
}: SoWhatQuestionListProps) {
  if (questions.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">
        어쩌라고?
      </h4>
      <div className="space-y-1.5">
        {questions.map((q, i) => (
          <div
            key={i}
            className="text-[13px] text-amber-900 font-medium flex gap-1.5 leading-relaxed"
          >
            <span className="text-amber-500 shrink-0">Q.</span>
            <span>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

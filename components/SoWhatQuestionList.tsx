"use client";

interface SoWhatQuestionListProps {
  questions: string[];
}

export default function SoWhatQuestionList({
  questions,
}: SoWhatQuestionListProps) {
  if (questions.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
        🤔 어쩌라고?
      </h4>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div
            key={i}
            className="text-sm text-amber-900 font-medium flex gap-2"
          >
            <span className="text-amber-500 shrink-0">Q.</span>
            <span>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

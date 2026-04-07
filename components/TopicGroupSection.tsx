"use client";

import { TopicGroupAnalysis } from "@/types/news";
import PerspectiveList from "./PerspectiveList";
import SoWhatQuestionList from "./SoWhatQuestionList";

interface TopicGroupSectionProps {
  group: TopicGroupAnalysis;
  index: number;
}

export default function TopicGroupSection({
  group,
  index,
}: TopicGroupSectionProps) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* 그룹 헤더 */}
      <div className="bg-neutral-800 text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-sm font-bold shrink-0">
            {index + 1}
          </span>
          <h3 className="text-lg font-bold leading-tight">
            {group.groupTitle}
          </h3>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* 공통 주제 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            공통 문제의식
          </h4>
          <ul className="space-y-1.5">
            {group.commonThemes.map((theme, i) => (
              <li key={i} className="text-sm text-gray-800 flex gap-2">
                <span className="text-neutral-400 shrink-0 mt-0.5">•</span>
                <span>{theme}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 칼럼별 관점 차이 */}
        <PerspectiveList perspectives={group.columnPerspectiveDiffs} />

        {/* 핵심 요약 */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            핵심 요약
          </h4>
          <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4">
            {group.coreSummary}
          </p>
        </div>

        {/* 어쩌라고? 질문 */}
        <SoWhatQuestionList questions={group.soWhatQuestions} />
      </div>
    </section>
  );
}

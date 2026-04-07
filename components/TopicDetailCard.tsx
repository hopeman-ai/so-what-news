"use client";

import { TopicGroupAnalysis } from "@/types/news";
import SoWhatQuestionList from "./SoWhatQuestionList";

interface TopicDetailCardProps {
  group: TopicGroupAnalysis;
  index: number;
}

export default function TopicDetailCard({
  group,
  index,
}: TopicDetailCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* ── 카드 헤더 ── */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 text-white text-xs font-bold shrink-0 mt-0.5">
            {index + 1}
          </span>
          <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
            {group.groupTitle}
          </h2>
        </div>
      </div>

      {/* ── 공통 문제의식 ── */}
      <div className="px-5 pb-3">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          공통 문제의식
        </h4>
        <ul className="space-y-1.5">
          {group.commonThemes.map((theme, i) => (
            <li
              key={i}
              className="text-[13px] text-gray-700 flex gap-1.5 leading-relaxed"
            >
              <span className="text-neutral-400 shrink-0">•</span>
              <span>{theme}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 칼럼별 관점 차이 ── */}
      <div className="px-5 pb-3">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          칼럼별 관점 차이
        </h4>
        <div className="space-y-3">
          {group.columnPerspectiveDiffs.map((item, i) => (
            <div key={i} className="pl-3 border-l-2 border-gray-200">
              <p className="text-[13px] text-gray-800 leading-relaxed">
                {item.viewpoint}
              </p>
              <span className="text-[11px] text-gray-400 mt-0.5 inline-block">
                #{item.publisher}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 핵심 요약 ── */}
      <div className="px-5 pb-3">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          핵심 요약
        </h4>
        <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3.5">
          {group.coreSummary}
        </p>
      </div>

      {/* ── 어쩌라고? ── */}
      <div className="px-5 pb-5">
        <SoWhatQuestionList questions={group.soWhatQuestions} />
      </div>
    </div>
  );
}

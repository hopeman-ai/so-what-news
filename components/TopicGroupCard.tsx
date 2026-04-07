"use client";

import { useState } from "react";
import { TopicGroupAnalysis } from "@/types/news";
import SoWhatQuestionList from "./SoWhatQuestionList";

interface TopicGroupCardProps {
  group: TopicGroupAnalysis;
  index: number;
}

export default function TopicGroupCard({
  group,
  index,
}: TopicGroupCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* ── 카드 헤더: 항상 보임 ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="px-4 py-3.5 flex items-start gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 text-white text-xs font-bold shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
              {group.groupTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {group.coreSummary}
            </p>
          </div>
          <span className="text-gray-400 text-sm shrink-0 mt-1">
            {expanded ? "△" : "▽"}
          </span>
        </div>
      </button>

      {/* ── 펼쳐지는 상세 ── */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* 공통 문제의식 */}
          <div className="px-4 pt-3 pb-2">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              공통 문제의식
            </h4>
            <ul className="space-y-1">
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

          {/* 칼럼별 관점 차이 */}
          <div className="px-4 pt-2 pb-2">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              칼럼별 관점 차이
            </h4>
            <div className="space-y-2.5">
              {group.columnPerspectiveDiffs.map((item, i) => (
                <div
                  key={i}
                  className="pl-3 border-l-2 border-gray-200"
                >
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

          {/* 핵심 요약 */}
          <div className="px-4 pt-2 pb-2">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              핵심 요약
            </h4>
            <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
              {group.coreSummary}
            </p>
          </div>

          {/* 어쩌라고? 질문 */}
          <div className="px-4 pt-1 pb-4">
            <SoWhatQuestionList questions={group.soWhatQuestions} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyNewsRecord, FullAnalysisResult } from "@/types/news";
import {
  loadDailyRecord,
  getAvailableDates,
  ensureSeedData,
} from "@/lib/storage";
import TopicTabs from "@/components/TopicTabs";
import TopicDetailCard from "@/components/TopicDetailCard";
import SourceListDrawer from "@/components/SourceListDrawer";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [record, setRecord] = useState<DailyNewsRecord | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(0);

  useEffect(() => {
    async function init() {
      await ensureSeedData();
      const dates = getAvailableDates();
      setAvailableDates(dates);
      if (dates.length > 0) setSelectedDate(dates[0]);
    }
    init();
  }, []);

  const loadDate = useCallback((date: string) => {
    setRecord(loadDailyRecord(date));
    setSelectedTopic(0); // 날짜 변경 시 첫 탭으로
  }, []);

  useEffect(() => {
    if (selectedDate) loadDate(selectedDate);
  }, [selectedDate, loadDate]);

  const analysis: FullAnalysisResult | null = record?.analysis || null;
  const articles = record?.items || [];
  const groups = analysis?.groups || [];
  const hasAnalysis = groups.length > 0;
  const currentGroup = groups[selectedTopic] || null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            어쩌라고?
          </h1>
          {articles.length > 0 && (
            <SourceListDrawer date={selectedDate} articles={articles} />
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 pb-6 flex-1 w-full">
        {availableDates.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-20">📰</div>
            <h2 className="text-lg font-bold text-gray-400 mb-2">
              아직 분석된 칼럼이 없습니다
            </h2>
            <p className="text-sm text-gray-400">
              관리자가 칼럼 데이터를 입력하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <>
            {/* ── 날짜 선택 ── */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`text-sm px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap shrink-0 ${
                    date === selectedDate
                      ? "bg-neutral-800 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>

            {hasAnalysis ? (
              <>
                {/* ── 주제 탭 ── */}
                <div className="mb-4">
                  <TopicTabs
                    groups={groups}
                    selectedIndex={selectedTopic}
                    onSelect={setSelectedTopic}
                  />
                </div>

                {/* ── 선택된 주제 상세 카드 ── */}
                {currentGroup && (
                  <TopicDetailCard
                    key={selectedTopic}
                    group={currentGroup}
                    index={selectedTopic}
                  />
                )}
              </>
            ) : record && record.items.length > 0 ? (
              <EmptyState
                title="분석 대기 중"
                description={`${record.items.length}개 칼럼이 저장되어 있지만, 아직 분석이 실행되지 않았습니다.`}
              />
            ) : (
              <EmptyState
                title="데이터 없음"
                description="이 날짜에 저장된 칼럼이 없습니다."
              />
            )}
          </>
        )}
      </main>

      {/* ── 하단 안내문구 ── */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            본 분석은 개별 칼럼 텍스트를 기준으로 AI가 요약한 것으로, 언론사
            전체의 공식 입장이나 성향을 대표하지 않습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${month}월 ${day}일 (${weekdays[d.getDay()]})`;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyNewsRecord, FullAnalysisResult } from "@/types/news";
import {
  loadDailyRecord,
  getAvailableDates,
  ensureSeedData,
} from "@/lib/storage";
import TopicGroupSection from "@/components/TopicGroupSection";
import SourceListDrawer from "@/components/SourceListDrawer";
import FooterDisclaimer from "@/components/FooterDisclaimer";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [record, setRecord] = useState<DailyNewsRecord | null>(null);

  useEffect(() => {
    async function init() {
      await ensureSeedData();
      const dates = getAvailableDates();
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
    init();
  }, []);

  const loadDate = useCallback((date: string) => {
    const r = loadDailyRecord(date);
    setRecord(r);
  }, []);

  useEffect(() => {
    if (selectedDate) loadDate(selectedDate);
  }, [selectedDate, loadDate]);

  const analysis: FullAnalysisResult | null = record?.analysis || null;
  const articles = record?.items || [];
  const hasAnalysis = analysis !== null && analysis.groups.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            어쩌라고 뉴스
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            문제 제기는 넘치는데, 그래서 어쩌라는 건지는 없는 뉴스 칼럼 분석기
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full">
        {availableDates.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-20">📰</div>
            <h2 className="text-xl font-bold text-gray-400 mb-2">
              아직 분석된 칼럼이 없습니다
            </h2>
            <p className="text-sm text-gray-400">
              관리자가 칼럼 데이터를 입력하면 이곳에 분석 결과가 표시됩니다.
            </p>
          </div>
        ) : (
          <>
            {/* ── 날짜 선택 + 데이터 소스 버튼 ── */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${
                      date === selectedDate
                        ? "bg-neutral-800 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>

              {articles.length > 0 && (
                <SourceListDrawer date={selectedDate} articles={articles} />
              )}
            </div>

            {/* ── 분석 결과 ── */}
            {hasAnalysis ? (
              <div>
                <div className="space-y-5">
                  {analysis!.groups.map((group, i) => (
                    <TopicGroupSection key={i} group={group} index={i} />
                  ))}
                </div>

                <FooterDisclaimer />

                <p className="text-xs text-gray-400 mt-6 text-right">
                  분석 시각:{" "}
                  {new Date(analysis!.analyzedAt).toLocaleString("ko-KR")}
                </p>
              </div>
            ) : record && record.items.length > 0 ? (
              <EmptyState
                title="분석 대기 중"
                description={`${selectedDate}에 ${record.items.length}개 칼럼이 저장되어 있지만, 아직 분석이 실행되지 않았습니다.`}
              />
            ) : (
              <EmptyState
                title="데이터 없음"
                description={`${selectedDate}에 저장된 칼럼이 없습니다.`}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-5 space-y-1 text-center">
          <p className="text-xs text-gray-400">
            어쩌라고 뉴스 — 뉴스 칼럼의 실행력을 따져보는 분석 도구
          </p>
          <p className="text-[11px] text-gray-400">
            본 분석은 개별 칼럼 텍스트를 기준으로 요약한 것으로, 언론사 전체의
            공식 입장이나 성향을 대표하지 않습니다.
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
  const weekday = weekdays[d.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

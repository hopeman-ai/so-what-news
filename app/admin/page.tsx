"use client";

import { useState } from "react";
import { parseBulkInput, ParsedArticleEntry } from "@/lib/parseInput";
import {
  NewsArticleInput,
  DailyNewsRecord,
  FullAnalysisResult,
} from "@/types/news";
import { saveDailyRecord, saveAnalysisResult } from "@/lib/storage";

type FetchedArticle = {
  publisher: string;
  title: string;
  url: string;
  content: string;
  success: boolean;
  error?: string;
};

type Step = "input" | "fetched" | "analyzed";

const SAMPLE_INPUT = `동아일보 : [사설]이란, 호르무즈 선별 통행 허용... 기회-위험 속 '모험'은 말아야
https://www.donga.com/news/Opinion/article/all/20260406/133687455/2

중앙일보 : 2년째 '100조 적자'…재정 건전화, 더 미룰 수 없다
https://www.joongang.co.kr/article/25418042

조선일보 : [사설] '중동 사태 에너지 전환 대책'에 원전이 빠지다니
https://www.chosun.com/opinion/editorial/2026/04/07/YHSUQQOTDVC7HEJGSPE3ET2JFQ/

한겨레신문 : [사설] 호르무즈해협 문제, '다각적 접근'으로 차분히 풀자
https://www.hani.co.kr/arti/opinion/editorial/1252925.html

매일경제 : "지폐에 장영실 새기자"... 과학기술강국 위한 설득력 있는 제안 [사설]
https://www.mk.co.kr/news/editorial/12009355

한국경제 : [기고] 저성장 극복을 위한 세가지 방안
https://www.hankyung.com/article/2026040624431`;

export default function AdminPage() {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [bulkText, setBulkText] = useState("");
  const [parsed, setParsed] = useState<ParsedArticleEntry[]>([]);
  const [fetched, setFetched] = useState<FetchedArticle[]>([]);
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<FullAnalysisResult | null>(null);

  // ── 1단계: 텍스트 파싱 + 기사 가져오기 ──
  const handleFetch = async () => {
    const entries = parseBulkInput(bulkText);
    if (entries.length === 0) {
      setError("파싱된 기사가 없습니다. 형식을 확인해주세요.");
      return;
    }
    setParsed(entries);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fetch-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `서버 오류 (${res.status})`);
      }

      const data = await res.json();
      setFetched(data.articles);
      setStep("fetched");

      // 가져온 기사를 localStorage에 저장
      const items: NewsArticleInput[] = data.articles
        .filter((a: FetchedArticle) => a.success && a.content)
        .map((a: FetchedArticle, i: number) => ({
          id: `art-${Date.now()}-${i}`,
          date,
          publisher: a.publisher,
          title: a.title,
          url: a.url,
          content: a.content,
        }));

      const record: DailyNewsRecord = { date, items };
      saveDailyRecord(record);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "기사 가져오기에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── 실패한 기사 본문 수동 입력 ──
  const handleManualContent = (index: number, content: string) => {
    setFetched((prev) =>
      prev.map((a, i) =>
        i === index
          ? { ...a, content, success: content.length > 30, error: undefined }
          : a
      )
    );
  };

  // ── 2단계: 분석 실행 ──
  const handleAnalyze = async () => {
    const validArticles = fetched
      .filter((a) => a.success && a.content && a.content.length > 30)
      .map((a, i) => ({
        id: `art-${Date.now()}-${i}`,
        date,
        publisher: a.publisher,
        title: a.title,
        url: a.url,
        content: a.content,
      }));

    if (validArticles.length === 0) {
      setError("분석 가능한 기사가 없습니다.");
      return;
    }

    // 먼저 저장
    const record: DailyNewsRecord = { date, items: validArticles };
    saveDailyRecord(record);

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: validArticles }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `서버 오류 (${res.status})`);
      }

      const result: FullAnalysisResult = await res.json();
      setAnalysisResult(result);
      saveAnalysisResult(date, result);
      setStep("analyzed");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "분석에 실패했습니다."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const successCount = fetched.filter((a) => a.success).length;
  const failCount = fetched.filter((a) => !a.success).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-neutral-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">어쩌라고 뉴스 — 관리자</h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                칼럼 목록 입력 → 기사 가져오기 → 분석 실행
              </p>
            </div>
            <a
              href="/"
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              서비스 화면 보기 →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 날짜 선택 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </div>

        {/* ── 단계 1: 벌크 입력 ── */}
        {step === "input" && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">
                칼럼 기사 목록 입력
              </h2>
              <button
                onClick={() => setBulkText(SAMPLE_INPUT)}
                className="text-xs text-gray-500 hover:text-neutral-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-neutral-400 transition-colors"
              >
                샘플 데이터 불러오기
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              형식: 한 줄에 &quot;언론사 : 제목&quot;, 다음 줄에 URL.
              빈 줄로 구분.
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`동아일보 : [사설]이란, 호르무즈 선별 통행 허용...\nhttps://www.donga.com/news/...\n\n중앙일보 : 2년째 '100조 적자'...\nhttps://www.joongang.co.kr/...`}
              rows={14}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
            />

            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleFetch}
              disabled={loading || !bulkText.trim()}
              className="mt-4 text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg px-6 py-2.5 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingDot /> 기사 가져오는 중...
                </span>
              ) : (
                "기사 가져오기"
              )}
            </button>
          </div>
        )}

        {/* ── 단계 2: 가져온 기사 확인 ── */}
        {step === "fetched" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-800 mb-1">
                기사 가져오기 결과
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                성공 {successCount}건 · 실패 {failCount}건
              </p>

              <div className="space-y-3">
                {fetched.map((article, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 ${
                      article.success
                        ? "border-green-200 bg-green-50/50"
                        : "border-red-200 bg-red-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              article.success
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {article.success ? "성공" : "실패"}
                          </span>
                          <span className="text-xs text-gray-400">
                            #{article.publisher}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </p>
                        {article.success && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {article.content.slice(0, 150)}...
                          </p>
                        )}
                        {article.error && (
                          <p className="text-xs text-red-600 mt-1">
                            {article.error}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 실패한 기사: 수동 입력 */}
                    {!article.success && (
                      <div className="mt-3">
                        <label className="text-xs text-gray-600 block mb-1">
                          본문 직접 입력 (붙여넣기):
                        </label>
                        <textarea
                          rows={4}
                          placeholder="기사 본문을 직접 붙여넣으세요..."
                          onChange={(e) =>
                            handleManualContent(i, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-neutral-800"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    setStep("input");
                    setFetched([]);
                    setError(null);
                  }}
                  className="text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2 transition-colors"
                >
                  ← 다시 입력
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || successCount === 0}
                  className="text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg px-6 py-2 transition-colors"
                >
                  {analyzing ? (
                    <span className="flex items-center gap-2">
                      <LoadingDot /> 분석 중... (10~30초 소요)
                    </span>
                  ) : (
                    `${successCount}개 기사 분석하기`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 단계 3: 분석 완료 ── */}
        {step === "analyzed" && analysisResult && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                분석 완료!
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                {date} · {fetched.filter((a) => a.success).length}개 칼럼 ·{" "}
                {analysisResult.groups.length}개 주제 그룹
              </p>
              <p className="text-xs text-gray-400 mb-6">
                분석 시각:{" "}
                {new Date(analysisResult.analyzedAt).toLocaleString("ko-KR")}
              </p>

              <div className="flex justify-center gap-3">
                <a
                  href="/"
                  className="text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg px-6 py-2.5 transition-colors"
                >
                  서비스 화면에서 결과 보기 →
                </a>
                <button
                  onClick={() => {
                    setStep("input");
                    setBulkText("");
                    setFetched([]);
                    setAnalysisResult(null);
                    setError(null);
                  }}
                  className="text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2.5 transition-colors"
                >
                  새 분석 시작
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingDot() {
  return (
    <span className="flex gap-0.5">
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

"use client";

import { useState } from "react";
import { NewsArticleInput } from "@/types/news";

interface SourceListDrawerProps {
  date: string;
  articles: NewsArticleInput[];
}

export default function SourceListDrawer({
  date,
  articles,
}: SourceListDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-500 hover:text-neutral-800 border border-gray-200 hover:border-neutral-400 rounded-lg px-3 py-1.5 transition-colors"
      >
        컬럼 원문 보기 ({articles.length}건)
      </button>

      {/* 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/30" />

          {/* 드로어 패널 */}
          <div
            className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  데이터 소스
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{date}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs text-gray-400 mb-4">
                아래 목록은 본 분석에 활용된 칼럼 원문 목록입니다.
              </p>

              <ol className="space-y-3">
                {articles.map((a, i) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="text-xs text-gray-400 font-medium mt-0.5 shrink-0 w-5 text-right">
                      {i + 1}.
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {a.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-400">
                          #{a.publisher}
                        </span>
                        {a.url && (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-500 hover:text-blue-700 hover:underline"
                          >
                            원문 보기 →
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="px-5 py-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                본 분석은 개별 칼럼 텍스트를 기준으로 요약한 것으로, 언론사
                전체의 공식 입장이나 성향을 대표하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { ArticleAnalysis, NewsArticleInput } from "@/types/news";

interface ArticleAnalysisCardProps {
  analysis: ArticleAnalysis;
  article?: NewsArticleInput;
}

export default function ArticleAnalysisCard({
  analysis,
  article,
}: ArticleAnalysisCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
          {analysis.topicLabel}
        </span>
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-1">
        {article?.title || `칼럼 ${analysis.articleId}`}
      </h3>
      {article?.publisher && (
        <span className="text-[11px] text-gray-400">#{article.publisher}</span>
      )}

      <div className="space-y-3 text-sm mt-3">
        <div>
          <span className="text-xs font-semibold text-gray-500">요약</span>
          <p className="text-gray-800 mt-1">{analysis.shortSummary}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-500">
            이 글에서 강조된 시각
          </span>
          <p className="text-gray-800 mt-1">{analysis.viewpointSummary}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-500">
            실행안 부족 여부
          </span>
          <p className="text-gray-700 mt-1">{analysis.actionGap}</p>
        </div>

        {analysis.soWhatQuestions.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <span className="text-xs font-semibold text-amber-700">
              어쩌라고?
            </span>
            <ul className="mt-1.5 space-y-1">
              {analysis.soWhatQuestions.map((q, i) => (
                <li key={i} className="text-amber-900 text-sm flex gap-1.5">
                  <span className="text-amber-500 shrink-0">Q.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {article?.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-neutral-500 hover:text-neutral-800"
        >
          원문 보기 →
        </a>
      )}
    </div>
  );
}

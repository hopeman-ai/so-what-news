"use client";

import { ColumnPerspectiveDiff } from "@/types/news";

interface PerspectiveListProps {
  perspectives: ColumnPerspectiveDiff[];
}

/**
 * 칼럼별 관점 차이 렌더링.
 * 문장 본문을 먼저 보여주고, 출처 언론사명은 해시태그 레이블로 표기.
 */
export default function PerspectiveList({
  perspectives,
}: PerspectiveListProps) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        칼럼별 관점 차이
      </h4>
      <div className="space-y-3">
        {perspectives.map((item, i) => (
          <div key={i} className="pl-3 border-l-2 border-gray-200">
            <p className="text-sm text-gray-800 leading-relaxed">
              {item.viewpoint}
            </p>
            <span className="inline-block mt-1 text-[11px] text-gray-400 font-medium">
              #{item.publisher}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

/**
 * 분석 결과 하단 안내 문구.
 * 개별 칼럼 텍스트 기반 분석임을 명시하는 면책 문구.
 */
export default function FooterDisclaimer() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 space-y-1 text-center">
      <p className="text-xs text-gray-400 leading-relaxed">
        본 분석은 개별 칼럼 텍스트를 기준으로 요약한 것으로, 언론사 전체의 공식
        입장이나 성향을 대표하지 않습니다.
      </p>
      <p className="text-[11px] text-gray-400 leading-relaxed">
        동일 언론사 내에서도 필자와 글의 성격에 따라 관점이 달라질 수 있습니다.
      </p>
    </div>
  );
}

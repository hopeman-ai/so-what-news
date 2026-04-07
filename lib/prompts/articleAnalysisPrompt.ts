import { NewsArticleInput } from "@/types/news";

/**
 * 개별 칼럼 분석용 유저 프롬프트.
 * 각 칼럼 텍스트를 분석하여 주제, 요약, 관점, 실행안 부족 여부, 질문을 추출.
 */
export function buildArticleAnalysisPrompt(
  articles: NewsArticleInput[]
): string {
  const block = articles
    .map(
      (a, i) =>
        `--- 칼럼 ${i + 1} ---
ID: ${a.id}
출처: ${a.publisher}
제목: ${a.title}
본문:
${a.content}
---`
    )
    .join("\n\n");

  return `아래 한국 언론사 사설/칼럼 텍스트들을 각각 분석해주세요.

${block}

주의사항:
- viewpointSummary는 "이 칼럼에서 강조된 시각" 1문장으로 쓰세요.
- 언론사명을 문장의 주어로 사용하지 마세요. 예) "경향신문은 ~라고 본다" (X)
- viewpointSummary는 "~라는 시각이 강조된다", "~에 대한 우려가 제기된다" 형식으로 쓰세요.

아래 JSON 형식으로만 응답하세요.

{
  "articles": [
    {
      "articleId": "칼럼 ID",
      "topicLabel": "대표 주제 (예: 에너지 전환, 재정 건전성)",
      "shortSummary": "2~3문장 요약",
      "viewpointSummary": "이 칼럼에서 강조된 시각 1문장",
      "actionGap": "실행안 부족 여부 1~2문장",
      "soWhatQuestions": ["어쩌라고? 질문1", "어쩌라고? 질문2"]
    }
  ]
}`;
}

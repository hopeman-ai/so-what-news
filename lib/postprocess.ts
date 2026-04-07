import { TopicGroupAnalysis } from "@/types/news";

/**
 * 요약문 후처리: 간접 보고체 종결 표현을 완결 문장으로 변환한다.
 * LLM이 프롬프트를 완벽히 따르지 않을 경우를 대비한 안전장치.
 */

const REPORT_ENDINGS: [RegExp, string][] = [
  [/라는 의견이 제시된다\.?$/, ""],
  [/라는 지적이 나온다\.?$/, ""],
  [/라는 시각이 강조된다\.?$/, ""],
  [/라는 주장이 제기된다\.?$/, ""],
  [/라는 주장이 드러난다\.?$/, ""],
  [/라는 분석이 나온다\.?$/, ""],
  [/것으로 전해진다\.?$/, ""],
  [/것으로 분석된다\.?$/, ""],
  [/것으로 보인다\.?$/, ""],
  [/것으로 평가된다\.?$/, ""],
  [/필요성이 제기된다\.?$/, "필요하다"],
  [/필요성이 강조된다\.?$/, "필요하다"],
  [/고 평가된다\.?$/, ""],
  [/고 분석된다\.?$/, ""],
];

function cleanSentence(text: string): string {
  let s = text.trim();

  // 보고체 종결 제거
  for (const [pattern, replacement] of REPORT_ENDINGS) {
    if (pattern.test(s)) {
      s = s.replace(pattern, replacement).trim();
      // 제거 후 "~다는", "~한다는" 잔여 어미 정리
      if (!replacement && /다는$/.test(s)) {
        s = s.replace(/다는$/, "다");
      }
      break;
    }
  }

  // 마침표 정리: 없으면 추가하지 않고, 중복이면 하나만
  s = s.replace(/\.+$/, "");

  return s;
}

export function postprocessGroups(
  groups: TopicGroupAnalysis[]
): TopicGroupAnalysis[] {
  return groups.map((group) => ({
    ...group,
    commonThemes: group.commonThemes.map(cleanSentence),
    coreSummary: cleanSentence(group.coreSummary),
    columnPerspectiveDiffs: group.columnPerspectiveDiffs.map((diff) => ({
      ...diff,
      viewpoint: cleanSentence(diff.viewpoint),
    })),
  }));
}

/**
 * 관리자가 붙여넣는 벌크 텍스트에서 기사 목록을 파싱한다.
 *
 * 입력 형식 예시:
 * 동아일보 : [사설]이란, 호르무즈 선별 통행 허용... 기회-위험 속 '모험'은 말아야
 * https://www.donga.com/news/Opinion/article/all/20260406/133687455/2
 *
 * 중앙일보 : 2년째 '100조 적자'...재정 건전화, 더 미룰 수 없다
 * https://www.joongang.co.kr/article/25418042
 */

export type ParsedArticleEntry = {
  publisher: string;
  title: string;
  url: string;
};

export function parseBulkInput(text: string): ParsedArticleEntry[] {
  const results: ParsedArticleEntry[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // URL만 있는 줄인지 확인
    if (isUrl(line)) {
      // 이전에 publisher:title 줄 없이 URL만 단독으로 있는 경우
      results.push({ publisher: "", title: "", url: line });
      i++;
      continue;
    }

    // "언론사 : 제목" 패턴 확인
    const match = line.match(/^(.+?)\s*[:：]\s*(.+)$/);
    if (match) {
      const publisher = match[1].trim();
      const title = match[2].trim();

      // 다음 줄이 URL인지 확인
      let url = "";
      if (i + 1 < lines.length && isUrl(lines[i + 1])) {
        url = lines[i + 1].trim();
        i += 2;
      } else {
        i++;
      }

      results.push({ publisher, title, url });
      continue;
    }

    // 매칭 안 되면 건너뛰기
    i++;
  }

  return results.filter((r) => r.url); // URL이 있는 항목만 반환
}

function isUrl(text: string): boolean {
  return /^https?:\/\//i.test(text.trim());
}

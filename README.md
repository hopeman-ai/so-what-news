# 어쩌라고 뉴스

> 문제 제기는 넘치는데, 그래서 어쩌라는 건지는 없는 뉴스 칼럼 분석기

한국 주요 언론사의 사설/칼럼을 AI로 분석하여, 유사 주제끼리 그룹핑하고 각 칼럼의 관점 차이와 실행력 부족을 짚어주는 서비스입니다.

## 주요 기능

- 날짜별 뉴스 칼럼 URL 일괄 입력 (관리자)
- URL에서 기사 본문 자동 크롤링
- OpenAI LLM을 활용한 주제 그룹 분석
  - 공통 문제의식
  - 칼럼별 관점 차이
  - 핵심 요약
  - "어쩌라고?" 질문 생성
- 사용자 화면에서 분석 결과 리포트 형태로 제공
- 원문 링크를 통한 데이터 소스 확인

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (gpt-4.1-mini)
- localStorage (MVP)

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local에 실제 OPENAI_API_KEY 입력

# 개발 서버 실행
npm run dev
```

- 사용자 화면: http://localhost:3000
- 관리자 화면: http://localhost:3000/admin

## 프로젝트 구조

```
app/
  page.tsx                       # 사용자 화면 (분석 결과 리포트)
  admin/page.tsx                 # 관리자 (URL 입력 → 크롤링 → 분석)
  api/analyze/route.ts           # OpenAI 분석 API
  api/fetch-articles/route.ts    # 기사 크롤링 API
components/                      # UI 컴포넌트
lib/
  openai.ts                      # OpenAI 클라이언트
  analyzeNews.ts                 # 분석 로직 + Zod 검증
  scraper.ts                     # HTML 파싱 (cheerio)
  prompts/                       # 시스템/유저 프롬프트
  postprocess.ts                 # 요약문 후처리
  storage.ts                     # localStorage 추상화
types/
  news.ts                        # 타입 정의
```

## 면책 조항

본 서비스의 분석 결과는 개별 칼럼 텍스트를 기준으로 AI가 자동 요약한 것으로, 언론사 전체의 공식 입장이나 성향을 대표하지 않습니다. 자세한 내용은 [DISCLAIMER.md](DISCLAIMER.md)를 참조하세요.

## 피드백

개선 제안이나 버그 신고는 [Issues](../../issues) 탭을 이용해 주세요.

## 라이선스

이 프로젝트는 교육 및 연구 목적의 MVP입니다. 분석 대상 뉴스 칼럼의 저작권은 각 언론사에 있습니다.

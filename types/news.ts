// ── 입력 타입 ──

export type NewsArticleInput = {
  id: string;
  date: string;
  publisher: string;
  title: string;
  url?: string;
  content: string;
};

// ── 개별 칼럼 분석 ──

export type ArticleAnalysis = {
  articleId: string;
  topicLabel: string;
  shortSummary: string;
  viewpointSummary: string; // 이 칼럼에서 강조된 시각
  actionGap: string;
  soWhatQuestions: string[];
};

// ── 그룹 분석 ──

export type ColumnPerspectiveDiff = {
  publisher: string; // 출처 레이블로만 사용
  viewpoint: string; // "~라는 시각이 강조된다" 형식
};

export type TopicGroupAnalysis = {
  groupTitle: string;
  articleIds: string[];
  commonThemes: string[];
  columnPerspectiveDiffs: ColumnPerspectiveDiff[];
  coreSummary: string;
  soWhatQuestions: string[];
};

export type GroupAnalysisResponse = {
  groups: TopicGroupAnalysis[];
};

// ── 전체 분석 결과 ──

export type FullAnalysisResult = {
  articles: ArticleAnalysis[];
  groups: TopicGroupAnalysis[];
  analyzedAt: string;
};

// ── 날짜별 저장 ──

export type DailyNewsRecord = {
  date: string;
  items: NewsArticleInput[];
  analysis?: FullAnalysisResult;
};

export type StorageData = {
  [date: string]: DailyNewsRecord;
};

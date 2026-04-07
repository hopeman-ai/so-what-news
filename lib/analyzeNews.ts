import { z } from "zod";
import {
  NewsArticleInput,
  ArticleAnalysis,
  TopicGroupAnalysis,
  FullAnalysisResult,
} from "@/types/news";
import { callOpenAI } from "./openai";
import { SYSTEM_PROMPT } from "./prompts/systemPrompt";
import { buildArticleAnalysisPrompt } from "./prompts/articleAnalysisPrompt";
import { buildGroupAnalysisPrompt } from "./prompts/groupAnalysisPrompt";
import { postprocessGroups } from "./postprocess";

// ── Zod 스키마: 응답 검증 ──

const ArticleAnalysisSchema = z.object({
  articleId: z.string(),
  topicLabel: z.string(),
  shortSummary: z.string(),
  viewpointSummary: z.string(),
  actionGap: z.string(),
  soWhatQuestions: z.array(z.string()),
});

const ArticleResponseSchema = z.object({
  articles: z.array(ArticleAnalysisSchema),
});

const ColumnPerspectiveDiffSchema = z.object({
  publisher: z.string(),
  viewpoint: z.string(),
});

const TopicGroupSchema = z.object({
  groupTitle: z.string(),
  articleIds: z.array(z.string()),
  commonThemes: z.array(z.string()),
  columnPerspectiveDiffs: z.array(ColumnPerspectiveDiffSchema),
  coreSummary: z.string(),
  soWhatQuestions: z.array(z.string()),
});

const GroupResponseSchema = z.object({
  groups: z.array(TopicGroupSchema),
});

// ── 분석 함수 ──

async function analyzeArticles(
  articles: NewsArticleInput[]
): Promise<ArticleAnalysis[]> {
  const prompt = buildArticleAnalysisPrompt(articles);
  const raw = await callOpenAI<unknown>(SYSTEM_PROMPT, prompt);
  const parsed = ArticleResponseSchema.parse(raw);
  return parsed.articles;
}

async function analyzeGroups(
  articles: NewsArticleInput[]
): Promise<TopicGroupAnalysis[]> {
  const prompt = buildGroupAnalysisPrompt(articles);
  const raw = await callOpenAI<unknown>(SYSTEM_PROMPT, prompt);
  const parsed = GroupResponseSchema.parse(raw);
  return postprocessGroups(parsed.groups);
}

/**
 * 전체 분석: 개별 칼럼 분석 + 주제 그룹 분석을 병렬 실행.
 */
export async function analyzeAllNews(
  articles: NewsArticleInput[]
): Promise<FullAnalysisResult> {
  if (articles.length === 0) {
    throw new Error("분석할 칼럼이 없습니다.");
  }

  const [articleResults, groupResults] = await Promise.all([
    analyzeArticles(articles),
    analyzeGroups(articles),
  ]);

  return {
    articles: articleResults,
    groups: groupResults,
    analyzedAt: new Date().toISOString(),
  };
}

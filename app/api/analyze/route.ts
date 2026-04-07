import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeAllNews } from "@/lib/analyzeNews";

const RequestSchema = z.object({
  articles: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      publisher: z.string(),
      title: z.string(),
      url: z.string().optional(),
      content: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { articles } = parsed.data;

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "분석할 기사가 없습니다." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인하세요." },
        { status: 500 }
      );
    }

    const result = await analyzeAllNews(articles);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    console.error("[/api/analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scrapeArticle } from "@/lib/scraper";

const RequestSchema = z.object({
  entries: z.array(
    z.object({
      publisher: z.string(),
      title: z.string(),
      url: z.string().url(),
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

    const { entries } = parsed.data;

    // 각 URL에서 기사 스크래핑 (병렬)
    const results = await Promise.all(
      entries.map(async (entry) => {
        const scraped = await scrapeArticle(entry.url);
        return {
          publisher: entry.publisher,
          title: scraped.title || entry.title, // 스크래핑 실패 시 입력된 제목 사용
          url: entry.url,
          content: scraped.content,
          success: scraped.success,
          error: scraped.error,
        };
      })
    );

    return NextResponse.json({ articles: results });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
    console.error("[/api/fetch-articles] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

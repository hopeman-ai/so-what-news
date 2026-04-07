import * as cheerio from "cheerio";

export type ScrapedArticle = {
  url: string;
  title: string;
  content: string;
  success: boolean;
  error?: string;
};

// 사이트별 본문 추출 셀렉터
const SITE_SELECTORS: Record<string, { content: string[]; title: string[] }> = {
  "donga.com": {
    content: ["#article_txt", ".article_txt", ".article-body"],
    title: ["h1.title", "h1", ".article_title"],
  },
  "joongang.co.kr": {
    content: ["#article_body", ".article_body", "#article-body"],
    title: ["h1.headline", "h1", ".headline"],
  },
  "chosun.com": {
    content: [
      "section.article-body",
      ".article-body",
      "[class*='article-body']",
      ".article__body",
      "article p",
    ],
    title: ["h1.article-header__headline", "h1", ".article-header__headline"],
  },
  "hani.co.kr": {
    content: [
      ".article-text",
      ".text",
      ".article-body",
      "[class*='article-text']",
      "div[class*='text'] p",
    ],
    title: [".article-title h4", ".article-title", "h4.title", "h1"],
  },
  "mk.co.kr": {
    content: [
      ".news_cnt_detail_wrap",
      "#article_body",
      ".article_body",
      ".art_txt",
    ],
    title: [".news_ttl", "h2.news_ttl", "h1"],
  },
  "hankyung.com": {
    content: [
      "#articletxt",
      ".article-body",
      "[class*='article-body']",
      ".article-contents",
    ],
    title: [".article-title", "h1.title", "h1"],
  },
  "khan.co.kr": {
    content: [".art_body", "#articleBody", ".article-body"],
    title: [".art_title h1", "h1"],
  },
  "sedaily.com": {
    content: [".article_view", "#article_txt"],
    title: [".article_tit h1", "h1"],
  },
};

// 기본 셀렉터 (사이트 매칭 안 될 때)
const DEFAULT_SELECTORS = {
  content: [
    "article",
    '[itemprop="articleBody"]',
    ".article-body",
    ".article-content",
    ".article_body",
    "#article_body",
    ".story-body",
    ".post-content",
    "main",
  ],
  title: [
    'meta[property="og:title"]',
    "h1",
    "title",
  ],
};

/**
 * URL에서 기사 본문과 제목을 추출한다.
 */
export async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        url,
        title: "",
        content: "",
        success: false,
        error: `HTTP ${response.status}`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 불필요한 요소 제거
    $(
      "script, style, nav, header, footer, aside, .ad, .advertisement, .social-share, .related-articles, figure, figcaption, .photo_area, .image, .caption"
    ).remove();

    // 사이트별 셀렉터 찾기
    const hostname = new URL(url).hostname;
    let selectors = DEFAULT_SELECTORS;
    for (const [domain, s] of Object.entries(SITE_SELECTORS)) {
      if (hostname.includes(domain)) {
        selectors = s;
        break;
      }
    }

    // 제목 추출
    let title = "";
    for (const sel of selectors.title) {
      if (sel.startsWith("meta")) {
        const meta = $(sel).attr("content");
        if (meta) {
          title = meta.trim();
          break;
        }
      } else {
        const el = $(sel).first();
        if (el.length && el.text().trim()) {
          title = el.text().trim();
          break;
        }
      }
    }

    // og:title 폴백
    if (!title) {
      title =
        $('meta[property="og:title"]').attr("content")?.trim() ||
        $("title").text().trim() ||
        "";
    }

    // 본문 추출
    let content = "";
    for (const sel of selectors.content) {
      const el = $(sel).first();
      if (el.length) {
        // 텍스트만 추출하되 문단 구분 유지
        const paragraphs: string[] = [];
        el.find("p, div > br").each((_, p) => {
          const text = $(p).text().trim();
          if (text && text.length > 10) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length > 0) {
          content = paragraphs.join("\n\n");
        } else {
          // p 태그가 없으면 전체 텍스트 추출
          content = el.text().trim();
        }

        if (content.length > 50) break;
      }
    }

    // og:description 폴백
    if (!content || content.length < 50) {
      const ogDesc =
        $('meta[property="og:description"]').attr("content")?.trim() || "";
      if (ogDesc.length > content.length) {
        content = ogDesc;
      }
    }

    // 본문 정리: 불필요한 공백 제거
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    // 너무 긴 본문은 앞 3000자로 자르기
    if (content.length > 3000) {
      content = content.slice(0, 3000) + "...";
    }

    if (!content || content.length < 30) {
      return {
        url,
        title,
        content: "",
        success: false,
        error: "본문을 추출하지 못했습니다. 직접 입력이 필요합니다.",
      };
    }

    return { url, title, content, success: true };
  } catch (err) {
    return {
      url,
      title: "",
      content: "",
      success: false,
      error: err instanceof Error ? err.message : "알 수 없는 오류",
    };
  }
}

/**
 * 여러 URL을 병렬로 스크래핑한다.
 */
export async function scrapeArticles(
  urls: string[]
): Promise<ScrapedArticle[]> {
  return Promise.all(urls.map((url) => scrapeArticle(url)));
}

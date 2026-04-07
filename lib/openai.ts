import OpenAI from "openai";

// 모델 상수 — 여기만 바꾸면 전체 모델이 변경됨
export const OPENAI_MODEL = "gpt-4.1-mini";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.");
  }
  client = new OpenAI({ apiKey });
  return client;
}

/**
 * OpenAI Chat Completion 호출.
 * JSON 응답을 요청하고 파싱하여 반환한다.
 */
export async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI 응답이 비어있습니다.");
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error(`OpenAI 응답 JSON 파싱 실패: ${content.slice(0, 200)}`);
  }
}

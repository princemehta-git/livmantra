import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const key = process.env.OPENAI_API_KEY;

export const openai = key ? new OpenAI({ apiKey: key }) : null;

export async function chatAssistant(
  userId: string | null,
  mode: string,
  message: string
) {
  if (!openai) {
    return { text: "OpenAI key not configured. This is a demo response." };
  }

  // Basic proxy example - keep prompts small and token-capped
  const system = `You are LivMantra assistant (mode: ${mode}). Keep reply short (<=120 words) and friendly.`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini", // adjust based on availability
    messages: [
      { role: "system", content: system },
      { role: "user", content: message },
    ],
    max_tokens: 300,
  });

  const text = resp.choices?.[0]?.message?.content ?? "Sorry no response";
  return { text };
}



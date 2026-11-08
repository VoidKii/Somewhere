import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BISCUIT_CHAT_URL = "https://biscuit-ytbellsroast-8207.vercel.app/api/chat";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body.message || "").trim();
  if (!message || message.length > 8000) {
    return NextResponse.json({ error: "Write a message under 8,000 characters." }, { status: 400 });
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-16).filter(item =>
        item && ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string"
      ).map(item => ({ role: item.role, content: item.content.slice(0, 8000) }))
    : [];

  const memories = body.mode === "about" && Array.isArray(body.memories)
    ? body.memories.slice(0, 12).filter(item => item && typeof item.content === "string").map(item => ({ content: item.content.slice(0, 1200) }))
    : [];

  try {
    const upstream = await fetch(BISCUIT_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, memories }),
      signal: AbortSignal.timeout(90000),
      cache: "no-store"
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json({ error: data.error || "BISCUIT is unavailable right now." }, { status: upstream.status });
    }
    if (!data.answer) {
      return NextResponse.json({ error: "The assistant returned an empty response." }, { status: 502 });
    }
    return NextResponse.json({ answer: data.answer, mode: data.mode || "cloud" });
  } catch {
    return NextResponse.json({
      error: "Couldn't reach BISCUIT right now. The portfolio is working, but its AI service may be offline."
    }, { status: 502 });
  }
}

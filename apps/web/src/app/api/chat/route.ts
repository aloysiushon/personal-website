import { NextRequest, NextResponse } from "next/server";
import { portfolioSchema } from "@/data/portfolio.schema";

// Build a system prompt from the portfolio schema data
function buildSystemPrompt(): string {
  const blocks = portfolioSchema.blocks;

  const heroBlock = blocks.find((b) => b.type === "hero");
  const aboutBlock = blocks.find((b) => b.type === "about");
  const skillsBlock = blocks.find((b) => b.type === "skills");
  const projectsBlock = blocks.find((b) => b.type === "projects");
  const contactBlock = blocks.find((b) => b.type === "contact");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hero = (heroBlock?.props ?? {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const about = (aboutBlock?.props ?? {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const skills = (skillsBlock?.props ?? {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = (projectsBlock?.props ?? {}) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contact = (contactBlock?.props ?? {}) as any;

  const skillCategories: string = (skills.categories ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => `${c.category}: ${(c.skills ?? []).join(", ")}`)
    .join("\n  - ");

  const projectList: string = (projects.projects ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p: any) => `• ${p.title}: ${p.description} (Tags: ${(p.tags ?? []).join(", ")})`)
    .join("\n  ");

  return `You are a friendly AI assistant embedded on ${hero.name ?? "the owner"}'s personal portfolio website. Your job is to answer visitor questions about the owner's background, skills, projects, and how to contact them.

Here is all the information you know about ${hero.name ?? "the owner"}:

ROLE & TAGLINE:
  Name: ${hero.name ?? "N/A"}
  Role: ${hero.role ?? "N/A"}
  Tagline: ${hero.tagline ?? "N/A"}

ABOUT:
  Bio: ${about.bio ?? "N/A"}
  Highlights: ${(about.highlights ?? []).join(", ")}

SKILLS:
  - ${skillCategories}

PROJECTS:
  ${projectList}

CONTACT:
  Email: ${contact.email ?? "N/A"}
  GitHub: ${contact.github ?? "N/A"}
  LinkedIn: ${contact.linkedin ?? "N/A"}

INSTRUCTIONS:
- Be concise, friendly, and helpful.
- Only answer questions related to ${hero.name ?? "the owner"}'s portfolio, background, skills, and projects.
- If asked something unrelated to the portfolio, politely redirect the conversation.
- Keep responses short (2-4 sentences) unless the visitor explicitly asks for more detail.
- Do not make up any information not listed above.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not available — no API key configured." },
      { status: 503 }
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required." }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://personal-website.dev",
        "X-Title": "Portfolio AI Chat",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: assistantMessage });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to reach AI service." }, { status: 500 });
  }
}

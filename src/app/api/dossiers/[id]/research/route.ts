import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { RESEARCH_SYSTEM_PROMPT } from '@/lib/ai/research-prompt';
import { ResearchResponseSchema } from '@/lib/ai/research-schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question } = body;
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Retrieve sources for the dossier
    const sources = await prisma.source.findMany({
      where: { dossierId: id },
    });

    if (sources.length === 0) {
      return NextResponse.json({
        answer: "Les sources disponibles dans ce dossier ne permettent pas de répondre à cette question.",
        sufficient: false,
        citations: []
      });
    }

    // Construct the context
    let context = "";
    sources.forEach((source, index) => {
      context += `SOURCE ${index + 1}\n`;
      context += `ID: ${source.id}\n`;
      context += `Titre: ${source.title}\n`;
      if (source.url) context += `URL: ${source.url}\n`;
      context += `Contenu:\n${source.content}\n\n`;
    });

    const userMessage = `${context}QUESTION:\n${question}`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o for structured output capability
      messages: [
        { role: "system", content: RESEARCH_SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "research_response",
          schema: {
            type: "object",
            properties: {
              answer: { type: "string" },
              sufficient: { type: "boolean" },
              citations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sourceId: { type: "string" },
                    sourceTitle: { type: "string" },
                    excerpt: { type: "string" }
                  },
                  required: ["sourceId", "sourceTitle", "excerpt"],
                  additionalProperties: false
                }
              }
            },
            required: ["answer", "sufficient", "citations"],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    // Validate the response with Zod
    const parsedData = JSON.parse(responseContent);
    const validatedData = ResearchResponseSchema.parse(parsedData);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Research API Error:", error);
    return NextResponse.json({ error: 'Failed to process research question' }, { status: 500 });
  }
}

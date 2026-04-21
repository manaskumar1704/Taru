import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"

const sessionSchema = z.object({
  topic: z.string(),
  grade: z.string(),
  quizScore: z.object({
    correct: z.number(),
    total: z.number(),
  }).nullable(),
})

const analysisResponseSchema = z.object({
  learningTrend: z.string().describe("A short evaluation of the user's overall performance"),
  strengths: z.array(z.string()).describe("Topics the user scored well on (70% or higher)"),
  focusAreas: z.array(z.string()).describe("Topics where the user scored poorly, suggesting review"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessions } = body

    if (!sessions || !Array.isArray(sessions)) {
      return NextResponse.json(
        { error: "Missing required field: sessions (array)" },
        { status: 400 }
      )
    }

    const parsedSessions = sessionSchema.array().safeParse(sessions)
    if (!parsedSessions.success) {
      return NextResponse.json(
        { error: "Invalid session data format" },
        { status: 400 }
      )
    }

    const validSessions = parsedSessions.data.filter(
      (s) => s.quizScore !== null
    )

    if (validSessions.length === 0) {
      return NextResponse.json(
        {
          learningTrend: "No quiz data available yet.",
          strengths: [],
          focusAreas: [],
          message: "Complete more quizzes to see your learning progress.",
        },
        { status: 200 }
      )
    }

    const groqPrimary = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-8b-8192",
      temperature: 0.3,
    })

    const groqFallback = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
    })

    const gemini = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.3,
    })

    const modelWithFallback = groqPrimary.withFallbacks({ fallbacks: [groqFallback, gemini] })

    const parser = StructuredOutputParser.fromZodSchema(analysisResponseSchema)
    const formatInstructions = parser.getFormatInstructions()

    const sessionsData = validSessions
      .map((s) => `- Topic: "${s.topic}" (Grade ${s.grade}) - Score: ${s.quizScore!.correct}/${s.quizScore!.total} (${Math.round((s.quizScore!.correct / s.quizScore!.total) * 100)}%)`)
      .join("\n")

    const prompt = PromptTemplate.fromTemplate(`
You are an educational evaluator analyzing a student's learning progress.

Analyze the following quiz sessions and provide structured feedback:
{sessions}

Below are the formatting instructions. You MUST strictly adhere to this format and return ONLY valid JSON.
{format_instructions}

---
Example output format:
{{
  "learningTrend": "Showing consistent improvement with strong performance in science topics.",
  "strengths": ["Photosynthesis", "Solar System"],
  "focusAreas": ["Fractions - needs more practice with denominators"]
}}
---

Now analyze the student's progress:
`)

    const chain = prompt.pipe(modelWithFallback).pipe(parser)

    const result = await chain.invoke({
      sessions: sessionsData,
      format_instructions: formatInstructions,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in analyze API route:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze learning progress. All underlying AI models might be unavailable.",
        details: error?.message || String(error),
      },
      { status: 500 }
    )
  }
}

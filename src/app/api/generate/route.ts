import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// 1. Zod Response Schema
export const lessonSchema = z.object({
  summary: z.string().describe("A 2-3 sentence beginner-friendly summary of the topic"),
  keyPoints: z.array(z.string()).describe("4-6 key points explaining the topic simply"),
  quiz: z.array(
    z.object({
      question: z.string().describe("A quiz question about the topic"),
      options: z.array(z.string()).describe("4 multiple choice options"),
      correctAnswer: z.string().describe("The correct answer, must match one of the options exactly"),
      explanation: z.string().describe("A brief explanation of why this answer is correct"),
    })
  ).describe("3 multiple-choice quiz questions"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, grade } = body;

    if (!topic || !grade) {
      return NextResponse.json(
        { error: "Missing required fields: topic and grade" },
        { status: 400 }
      );
    }

    // 2. Model Initialization with Fallbacks
    const groqPrimary = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama3-8b-8192",
      temperature: 0.3,
    });

    const groqFallback = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
    });

    const gemini = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-1.5-flash",
      temperature: 0.3,
    });

    const modelWithFallback = groqPrimary.withFallbacks({ fallbacks: [groqFallback, gemini] });

    // 3. Parser Initialization
    const parser = StructuredOutputParser.fromZodSchema(lessonSchema);
    const formatInstructions = parser.getFormatInstructions();

    // 4. Prompt Template
    const prompt = PromptTemplate.fromTemplate(`
You are an expert educational tutor. Your task is to explain complex concepts in a simplified, easy-to-understand way for a student in {grade}.

Below are the formatting instructions. You MUST strictly adhere to this format and return ONLY valid JSON.
{format_instructions}

---
Here is an example of what your output should look like for the topic "Photosynthesis" for "Grade 5":
{{
  "summary": "Photosynthesis is how plants make their own food using sunlight. They breathe in the air we breathe out, drink water from the soil, and use the sun's energy to turn it into sugary food! In return, they give us fresh oxygen to breathe.",
  "keyPoints": [
    "Plants are like tiny factories that make their own food.",
    "They need three ingredients: sunlight, water, and carbon dioxide (a type of gas in the air).",
    "Leaves have a special green pigment called chlorophyll that catches sunlight.",
    "The process creates sugar (food for the plant) and oxygen (air for us)."
  ],
  "quiz": [
    {{
      "question": "What is the main energy source for photosynthesis?",
      "options": ["Water", "Soil", "Sunlight", "Wind"],
      "correctAnswer": "Sunlight",
      "explanation": "Plants capture energy from sunlight to power the process of making their food."
    }}
  ]
}}
---

Now, perform the same task for the following topic:
Topic: {topic}
Grade Level: {grade}
`);

    // 5. Chain Assembly
    const chain = prompt.pipe(modelWithFallback).pipe(parser);

    const result = await chain.invoke({
      topic,
      grade,
      format_instructions: formatInstructions,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in generate API route:", error);
    
    // Provide a generic fallback message but log the actual error
    return NextResponse.json(
      { 
        error: "Failed to generate lesson content. All underlying AI models might be unavailable or the response could not be parsed.",
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

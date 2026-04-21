# Agent Instructions: AI Learning Assistant

## Core Objective
Build a full-stack Next.js (App Router) application that accepts a topic and grade level, uses LangChain to generate a structured educational breakdown, and displays it on a modern, animated React frontend. 

## Tech Stack & Tooling
- Framework: Next.js (App Router)
- Package Manager: Bun (Use `bun install`, `bun add`, `bun run dev`, `bunx` exclusively)
- Backend AI: LangChain (LangChain.js) 
- Primary LLM: Groq (`@langchain/groq`)
- Fallback LLM: Google GenAI (`@langchain/google-genai`)
- Data Validation: Zod
- Styling & UI: Tailwind CSS, shadcn/ui
- Animation: Framer Motion

## Step-by-Step Execution Plan

### 1. Project Initialization & UI Setup
- Scaffold a Next.js App Router project using Bun.
- Initialize `shadcn/ui` using Bun.
- Install dependencies: `@langchain/groq`, `@langchain/google-genai`, `langchain`, `zod`, `framer-motion`, `lucide-react`.
- Create a `.env.local` file for `GROQ_API_KEY` and `GOOGLE_API_KEY`.
- Install necessary shadcn components: `card`, `button`, `input`, `select`, `skeleton`, `alert`.

### 2. Backend / AI Processing Layer (`app/api/generate/route.ts`)
- Define a strict Zod schema for the response: `summary` (string), `keyPoints` (array of strings), and `quiz` (array of objects with `question`, `options`, `correctAnswer` and `explanation`).
- Initialize `ChatGroq` as the primary model (e.g., `llama3-8b-8192` or `mixtral-8x7b-32768` for extreme speed).
- Initialize `ChatGoogleGenerativeAI` (Gemini 1.5 Flash) as the fallback model.
- Chain the models using LangChain's `.withFallbacks()` method to ensure high availability.
- Use `StructuredOutputParser.fromZodSchema()` to enforce the output format.
- Create a `PromptTemplate` incorporating few-shot prompting to dictate the "beginner/younger student" tone.
- Execute the chain, parse the output, and return the structured JSON. Implement robust error handling to return a 500 status with an error message if both models fail.

### 3. Frontend UI & State Management (`app/page.tsx`)
- Build a client component with inputs for Topic and Grade, and a primary submit button.
- Implement a Local Storage hook to automatically save and retrieve the last 3 generated lessons. Display these as clickable "Recent Searches" in a sidebar or dropdown.
- Map the JSON response to three distinct UI sections: Summary, Key Points, and Quiz.
- Use shadcn `Skeleton` components to create a pulsing loading state while awaiting the API response.
- Use shadcn `Alert` components to display error states gracefully.

### 4. Animation & Polish
- Wrap the main result cards in Framer Motion `<motion.div>` tags to trigger staggered fade-ins.
- Add tap animations to the interactive quiz buttons. Implement conditional styling for selected answers (green for correct, red for incorrect) revealing the answer only after selection.

## Strict Rules
- Do NOT use or configure any containerization (no Docker, no Kubernetes) or cloud deployment setups like AWS. Rely purely on Next.js/Vercel standard deployments.
- Use `{}` for any bolding text in documentation or markdown generation, do not use standard markdown asterisks.
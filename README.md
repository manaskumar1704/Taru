# AI Learning Assistant

A full-stack Next.js application that transforms complex topics into engaging, grade-appropriate educational content. Users input a topic and grade level, and the application uses LangChain-powered AI to generate structured lesson breakdowns with summaries, key points, and interactive quizzes.

---

## Features

- **Dynamic Content Generation:** AI-powered lesson creation tailored to any educational topic
- **Adaptive Grade-Level Simplification:** Automatically adjusts complexity based on the selected grade level (K-12)
- **Interactive Quiz System:** Multiple-choice questions with instant feedback, explanations, and visual answer validation
- **LangChain AI Pipeline:** Structured output parsing with dual-LLM fallback for high availability
- **Recent History Persistence:** Local Storage-based session management saving the last 3 generated lessons
- **Animated React Frontend:** Smooth transitions using Framer Motion and a modern dark-mode aesthetic

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Package Manager | Bun |
| Backend AI | LangChain.js |
| Primary LLM | Groq (Llama 3.1 8B) |
| Fallback LLM | Google Gemini 1.5 Flash |
| Data Validation | Zod |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |

---

## Architecture & Approach

### Dual-LLM Fallback Strategy

The application prioritizes response speed while ensuring reliability. The API route chains three models using LangChain's `.withFallbacks()`:

1. **Primary:** Groq Llama 3.1 8B (ultra-fast inference)
2. **Secondary:** Groq Llama 3.1 8B Instant (fallback)
3. **Tertiary:** Google Gemini 1.5 Flash (cross-provider resilience)

If the primary model fails or times out, the chain automatically escalates to the next available model. This architecture eliminates single-point-of-failure scenarios common with individual API keys.

### Strict JSON Schema Validation

Zod defines the complete response structure at the type level:

- `summary`: 2-3 sentence beginner-friendly overview
- `keyPoints`: Array of 4-6 simplified explanations
- `quiz`: Array of 3 question objects with options, correct answers, and explanations

LangChain's `StructuredOutputParser.fromZodSchema()` enforces this schema at runtime, eliminating manual parsing errors and ensuring type-safe responses.

### Local Storage for Session Management

Rather than deploying a database, the application uses React hooks backed by browser Local Storage to persist the last 3 generated lessons. This approach:

- Reduces infrastructure complexity to zero
- Eliminates cold-start latency on page refresh
- Keeps the application stateless and horizontally scalable
- Respects the assignment's requirement for a lightweight, flexible architecture

---

## Setup Instructions

### Prerequisites

- Bun runtime installed
- Groq API key ([get one here](https://console.groq.com))
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apis))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/taru.git
cd taru
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Start the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Assumptions Made

- **Local Storage over Database:** Given the assignment's emphasis on flexibility and speed, Local Storage was chosen to persist recent lessons. This decision keeps the application lightweight and eliminates backend infrastructure requirements, though a production deployment would likely migrate this to a proper session store or database.
- **Dual-Provider Strategy:** The fallback to Gemini assumes both API keys are valid. In a production environment, key rotation and quota monitoring would be implemented.
- **Client-Side History:** Recent searches are stored in the browser, meaning they are device-specific. A more robust solution would sync across devices via authentication.

---

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # AI generation endpoint
│   ├── page.tsx                # Main dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/             # Dashboard components
│   └── ui/                    # shadcn/ui components
├── hooks/
│   └── useLocalHistory.ts     # Local Storage hook
└── lib/
    └── utils.ts               # Utility functions
```

---

## License

This project is for educational purposes.

---

Author: Manas Kumar
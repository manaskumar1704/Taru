import { describe, expect, test, mock, beforeEach } from "bun:test";
import { NextRequest } from "next/server";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessage } from "@langchain/core/messages";

// --- Mock Implementations ---

// Define a valid JSON response string that the LLM would return
const validJSONResponse = String.raw`{
  "summary": "Mocked summary",
  "keyPoints": ["Mocked point 1", "Mocked point 2", "Mocked point 3", "Mocked point 4"],
  "quiz": [
    {
      "question": "Q1",
      "options": ["O1", "O2", "O3", "O4"],
      "correctAnswer": "O1",
      "explanation": "E1"
    },
    {
      "question": "Q2",
      "options": ["O1", "O2", "O3", "O4"],
      "correctAnswer": "O2",
      "explanation": "E2"
    },
    {
      "question": "Q3",
      "options": ["O1", "O2", "O3", "O4"],
      "correctAnswer": "O3",
      "explanation": "E3"
    }
  ]
}`;

// We will use these globals to control mock behavior per-test
let groqShouldFail = false;
let geminiShouldFail = false;

// Custom mocked class inheriting from LangChain's BaseChatModel
// This ensures methods like .pipe() and .withFallbacks() are inherently available
class MockChatGroq extends BaseChatModel {
  _llmType() { return "mock_groq"; }
  async _generate(_messages: any, _options: any, _runManager: any): Promise<any> {
    if (groqShouldFail) {
      throw new Error("Mocked Groq Failure");
    }
    return {
      generations: [{ message: new AIMessage(validJSONResponse), text: validJSONResponse }],
    };
  }
}

class MockChatGemini extends BaseChatModel {
  _llmType() { return "mock_gemini"; }
  async _generate(_messages: any, _options: any, _runManager: any): Promise<any> {
    if (geminiShouldFail) {
      throw new Error("Mocked Gemini Failure");
    }
    return {
      generations: [{ message: new AIMessage(validJSONResponse), text: validJSONResponse }],
    };
  }
}

// Intercept module imports
mock.module("@langchain/groq", () => {
  return {
    ChatGroq: MockChatGroq,
  };
});

mock.module("@langchain/google-genai", () => {
  return {
    ChatGoogleGenerativeAI: MockChatGemini,
  };
});

// Import the route AFTER mocking the modules
import { POST } from "../../src/app/api/generate/route";

describe("Generate API Integration Tests", () => {
  beforeEach(() => {
    // Reset flags before each test
    groqShouldFail = false;
    geminiShouldFail = false;
  });

  const makeReq = (body: any) => {
    return new NextRequest("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  test("1. 400 on missing topic", async () => {
    const req = makeReq({ grade: "5" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields: topic and grade");
  });

  test("2. 400 on missing grade", async () => {
    const req = makeReq({ topic: "Gravity" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields: topic and grade");
  });

  test("3. 400 on empty body", async () => {
    const req = makeReq({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields: topic and grade");
  });

  test("4. 200 with correct JSON shape", async () => {
    const req = makeReq({ topic: "Gravity", grade: "8" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("Mocked summary");
    expect(data.keyPoints.length).toBe(4);
    expect(data.quiz.length).toBe(3);
  });

  test("5. Fallback works when Groq fails", async () => {
    groqShouldFail = true; // force Groq to fail so Gemini fallback steps in
    const req = makeReq({ topic: "Gravity", grade: "8" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("Mocked summary");
  });

  test("6. 500 when both models fail", async () => {
    groqShouldFail = true;
    geminiShouldFail = true;
    const req = makeReq({ topic: "Gravity", grade: "8" });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Failed to generate lesson content");
  });
});

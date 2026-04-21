import { describe, expect, test } from "bun:test";
import { lessonSchema } from "../../src/app/api/generate/route";

describe("Generate API Unit Tests - Zod Schema", () => {
  const validData = {
    summary: "This is a valid summary.",
    keyPoints: ["Point 1", "Point 2", "Point 3", "Point 4"],
    quiz: [
      {
        question: "What is 2+2?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "4",
        explanation: "Basic math",
      },
      {
        question: "Color of the sky?",
        options: ["Red", "Green", "Blue", "Black"],
        correctAnswer: "Blue",
        explanation: "Rayleigh scattering",
      },
      {
        question: "Earth is flat?",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "It is an oblate spheroid",
      },
    ],
  };

  test("1. Well-formed data passes", () => {
    const result = lessonSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("2. Missing summary fails", () => {
    const { summary, ...rest } = validData;
    const result = lessonSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("3. Missing keyPoints fails", () => {
    const { keyPoints, ...rest } = validData;
    const result = lessonSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("4. Missing quiz fails", () => {
    const { quiz, ...rest } = validData;
    const result = lessonSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("5. Wrong type for summary", () => {
    const data = { ...validData, summary: 123 };
    const result = lessonSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("6. Quiz item missing correctAnswer", () => {
    const { correctAnswer, ...invalidQuiz } = validData.quiz[0];
    const data = { ...validData, quiz: [invalidQuiz] };
    const result = lessonSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("7. Quiz options not an array", () => {
    const invalidQuiz = { ...validData.quiz[0], options: "not-array" };
    const data = { ...validData, quiz: [invalidQuiz] };
    const result = lessonSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  test("8. Empty keyPoints array passes", () => {
    const data = { ...validData, keyPoints: [] };
    const result = lessonSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

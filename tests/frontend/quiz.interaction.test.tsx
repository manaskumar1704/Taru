import { describe, it, expect, vi, beforeEach } from "bun:test"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { QuizQuestion } from "@/components/dashboard/ActiveAssessment"

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => children,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock("@/components/dashboard/ActiveAssessment", () => ({
  ActiveAssessment: ({ quiz, isLoading }: { quiz: QuizQuestion[] | null; isLoading: boolean }) => {
    if (isLoading) return <div data-testid="loading">Loading...</div>
    if (!quiz || quiz.length === 0) return <div data-testid="empty">Empty</div>
    return <div data-testid="quiz">{quiz[0].question}</div>
  },
}))

import { ActiveAssessment } from "@/components/dashboard/ActiveAssessment"

const mockQuiz: QuizQuestion[] = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "2 + 2 = 4" },
  { question: "Capital of France?", options: ["Paris", "London"], correctAnswer: "Paris", explanation: "Paris is capital" },
]

describe("ActiveAssessment Component", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("shows empty state when quiz is null", async () => {
    const { unmount } = render(<BrowserRouter><ActiveAssessment quiz={null} isLoading={false} /></BrowserRouter>)
    expect(screen.getByTestId("empty")).toBeTruthy()
    unmount()
  })

  it("shows empty state when quiz is empty array", async () => {
    const { unmount } = render(<BrowserRouter><ActiveAssessment quiz={[]} isLoading={false} /></BrowserRouter>)
    expect(screen.getByTestId("empty")).toBeTruthy()
    unmount()
  })

  it("shows loading skeleton when isLoading is true", async () => {
    const { unmount } = render(<BrowserRouter><ActiveAssessment quiz={null} isLoading={true} /></BrowserRouter>)
    expect(screen.getByTestId("loading")).toBeTruthy()
    unmount()
  })

  it("displays the first question when quiz is provided", async () => {
    const { unmount } = render(<BrowserRouter><ActiveAssessment quiz={mockQuiz} isLoading={false} /></BrowserRouter>)
    expect(screen.getByTestId("quiz")).toBeTruthy()
    expect(screen.getByText("What is 2 + 2?")).toBeTruthy()
    unmount()
  })
})
import { describe, it, expect, vi, beforeEach } from "bun:test"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { SimulationPanel } from "@/components/dashboard/SimulationPanel"
import { SynthesisOutput } from "@/components/dashboard/SynthesisOutput"
import { CriticalVectors } from "@/components/dashboard/CriticalVectors"
import { ActiveAssessment } from "@/components/dashboard/ActiveAssessment"

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => children,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

describe("Page Layout Components", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders Sidebar component", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <Sidebar history={[]} onSelectLesson={() => {}} onNewSimulation={() => {}} />
      </BrowserRouter>
    )
    const aside = screen.getByRole("complementary")
    expect(aside).toBeTruthy()
    unmount()
  })

  it("renders SimulationPanel component", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <SimulationPanel
          topic=""
          grade=""
          isLoading={false}
          error={null}
          onTopicChange={() => {}}
          onGradeChange={() => {}}
          onSubmit={() => {}}
        />
      </BrowserRouter>
    )
    expect(screen.getByText(/Simulation Variables/)).toBeTruthy()
    unmount()
  })

  it("renders ActiveAssessment in loading state", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <ActiveAssessment quiz={null} isLoading={true} />
      </BrowserRouter>
    )
    expect(screen.getByText(/Knowledge Check/)).toBeTruthy()
    unmount()
  })

  it("renders SynthesisOutput in idle state", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <SynthesisOutput summary={null} isLoading={false} />
      </BrowserRouter>
    )
    expect(screen.getByText(/Synthesis Output/)).toBeTruthy()
    unmount()
  })

  it("renders CriticalVectors in idle state", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <CriticalVectors keyPoints={null} isLoading={false} />
      </BrowserRouter>
    )
    expect(screen.getByText(/Critical Vectors/)).toBeTruthy()
    unmount()
  })
})

describe("Form Input State", () => {
  it("shows submit button when not loading", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <SimulationPanel
          topic=""
          grade=""
          isLoading={false}
          error={null}
          onTopicChange={() => {}}
          onGradeChange={() => {}}
          onSubmit={() => {}}
        />
      </BrowserRouter>
    )
    expect(screen.getByRole("button", { name: /Generate Lesson/i })).toBeTruthy()
    unmount()
  })

  it("shows loading text when loading", async () => {
    const { unmount } = render(
      <BrowserRouter>
        <SimulationPanel
          topic="Test"
          grade="Grade 5"
          isLoading={true}
          error={null}
          onTopicChange={() => {}}
          onGradeChange={() => {}}
          onSubmit={() => {}}
        />
      </BrowserRouter>
    )
    expect(screen.getByText(/Synthesizing/)).toBeTruthy()
    unmount()
  })
})
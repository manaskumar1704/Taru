"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { Menu } from "lucide-react"

import { useLocalHistory, LessonResponse, LessonHistoryItem } from "@/hooks/useLocalHistory"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { SimulationPanel } from "@/components/dashboard/SimulationPanel"
import { SynthesisOutput } from "@/components/dashboard/SynthesisOutput"
import { CriticalVectors } from "@/components/dashboard/CriticalVectors"
import { ActiveAssessment } from "@/components/dashboard/ActiveAssessment"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
}

export default function Dashboard() {
  const [topic, setTopic] = useState("")
  const [grade, setGrade] = useState("")
  const [lessonData, setLessonData] = useState<LessonResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { history, addLesson } = useLocalHistory()

  const handleGenerate = async () => {
    if (!topic || !grade) {
      setError("Please provide both a topic and grade level.")
      return
    }

    setIsLoading(true)
    setError(null)
    setLessonData(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, grade }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to synthesize data.")
      }

      setLessonData(data)
      addLesson(topic, grade, data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected system error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectLesson = (lesson: LessonHistoryItem) => {
    setTopic(lesson.topic)
    setGrade(lesson.grade)
    setLessonData(lesson.data)
    setError(null)
    setIsMobileMenuOpen(false)
  }

  const handleNewSimulation = () => {
    setTopic("")
    setGrade("")
    setLessonData(null)
    setError(null)
    setIsMobileMenuOpen(false)
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.18,
      },
    },
  }

  // Trigger animation when data loads or we enter loading state
  const shouldAnimate = isLoading || !!lessonData

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar 
        history={history} 
        onSelectLesson={handleSelectLesson} 
        onNewSimulation={handleNewSimulation} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/60 backdrop-blur-md">
          <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
            TARU<span className="text-primary">.</span>
          </h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger render={
              <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                <Menu className="size-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            } />
            <SheetContent side="left" className="w-[280px] p-0 border-r-border bg-background sm:w-[320px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              {/* Reuse sidebar internals for mobile */}
              <div className="h-full">
                <Sidebar 
                  history={history} 
                  onSelectLesson={handleSelectLesson} 
                  onNewSimulation={handleNewSimulation} 
                />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl w-full flex flex-col xl:flex-row gap-6 h-full pb-8">
            
            {/* Left Column: Form */}
            <div className="w-full xl:w-[360px] shrink-0">
              <SimulationPanel
                topic={topic}
                grade={grade}
                isLoading={isLoading}
                error={error}
                onTopicChange={setTopic}
                onGradeChange={setGrade}
                onSubmit={handleGenerate}
              />
            </div>

            {/* Right Column: Results Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={shouldAnimate ? "show" : "hidden"}
              className="flex-1 flex flex-col gap-6"
            >
              {/* Top spanning card */}
              <div className="w-full shrink-0">
                <SynthesisOutput 
                  summary={lessonData?.summary || null} 
                  isLoading={isLoading} 
                />
              </div>

              {/* Bottom split cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full flex-1 min-h-[400px]">
                <CriticalVectors 
                  keyPoints={lessonData?.keyPoints || null} 
                  isLoading={isLoading} 
                />
                
                <ActiveAssessment 
                  quiz={lessonData?.quiz || null} 
                  isLoading={isLoading} 
                />
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  )
}

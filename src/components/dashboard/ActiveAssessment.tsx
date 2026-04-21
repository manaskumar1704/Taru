"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ArrowRight } from "lucide-react"
import { cardVariants } from "@/app/page"

const ActiveBadge = () => (
  <span className="badge-active inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 self-start">
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tertiary" />
    </span>
    ACTIVE ASSESSMENT
  </span>
)

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface ActiveAssessmentProps {
  quiz: QuizQuestion[] | null
  isLoading: boolean
  onScoreSubmit?: (score: { correct: number; total: number }) => void
}

export function ActiveAssessment({ quiz, isLoading, onScoreSubmit }: ActiveAssessmentProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Reset state when new quiz data comes in
  useEffect(() => {
    setCurrentIdx(0)
    setSelectedOpt(null)
    setCorrectAnswers(0)
    setIsSubmitted(false)
  }, [quiz])

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass ghost-border rounded-2xl p-6 flex flex-col gap-4 flex-1 h-[400px]">
        <div className="space-y-2 shrink-0 flex flex-col">
          <ActiveBadge />
          <h2 className="font-heading text-xl font-semibold tracking-tight">Knowledge Check</h2>
        </div>
        <div className="mt-4 space-y-4 flex-1">
          <Skeleton className="h-6 w-3/4 bg-accent mb-6" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg bg-accent" />
          ))}
        </div>
      </motion.div>
    )
  }

  if (!quiz || quiz.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass ghost-border rounded-2xl p-6 flex flex-col gap-4 flex-1 h-[400px]">
        <div className="space-y-2 shrink-0 flex flex-col">
          <ActiveBadge />
          <h2 className="font-heading text-xl font-semibold tracking-tight">Knowledge Check</h2>
        </div>
        <div className="h-full flex items-center justify-center min-h-[100px] flex-1">
          <p className="text-muted-foreground/50 italic text-sm">Awaiting simulation data.</p>
        </div>
      </motion.div>
    )
  }

  const question = quiz[currentIdx]
  const isAnswered = selectedOpt !== null
  const isCorrect = selectedOpt === question.correctAnswer
  const progressPercent = ((currentIdx + (isAnswered ? 1 : 0)) / quiz.length) * 100

  const handleSelect = (opt: string) => {
    if (isAnswered) return
    setSelectedOpt(opt)
    if (opt === question.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx((prev) => prev + 1)
      setSelectedOpt(null)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    if (onScoreSubmit) {
      onScoreSubmit({ correct: correctAnswers, total: quiz.length })
    }
  }

  return (
    <motion.div variants={cardVariants} className="glass ghost-border rounded-2xl p-6 flex flex-col gap-4 flex-1 h-[400px] relative overflow-hidden">
      <div className="flex justify-between items-start shrink-0">
        <div className="space-y-2 flex flex-col">
          <ActiveBadge />
          <h2 className="font-heading text-xl font-semibold tracking-tight">Knowledge Check</h2>
        </div>
        <div className="text-xs font-heading font-medium text-muted-foreground bg-accent/50 px-2 py-1 rounded">
          {currentIdx + 1} / {quiz.length}
        </div>
      </div>

      {/* The Conduit (Progress Bar) */}
      <div className="w-full bg-accent h-1 rounded-full overflow-hidden shrink-0">
        <motion.div 
          className="h-full bg-tertiary pulse-glow"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 mt-2 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            <h3 className="text-sm font-medium text-foreground mb-4 leading-relaxed">{question.question}</h3>
            
            <div className="space-y-2 mb-4 shrink-0">
              {question.options.map((opt, i) => {
                const isSelected = selectedOpt === opt
                const isThisCorrect = opt === question.correctAnswer
                const showSuccess = isAnswered && isThisCorrect
                const showError = isAnswered && isSelected && !isCorrect

                let bgClass = "bg-input/50 hover:bg-input"
                let borderClass = "border-transparent"
                let textClass = "text-muted-foreground"

                if (showSuccess) {
                  bgClass = "bg-tertiary/20"
                  borderClass = "border-tertiary/50 shadow-[0_0_10px_color-mix(in_srgb,var(--tertiary)__30%,transparent)]"
                  textClass = "text-tertiary"
                } else if (showError) {
                  bgClass = "bg-destructive/20"
                  borderClass = "border-destructive/50"
                  textClass = "text-destructive"
                } else if (isAnswered) {
                  bgClass = "bg-input/20 opacity-60 pointer-events-none"
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.95 } : {}}
                    transition={{ duration: 0.1 }}
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left text-sm option-btn ${bgClass} ${borderClass} ${textClass} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span>{opt}</span>
                    {showSuccess && <Check className="size-4 text-tertiary shrink-0" />}
                    {showError && <X className="size-4 text-destructive shrink-0" />}
                  </motion.button>
                )
              })}
            </div>

            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-xs text-muted-foreground bg-accent/30 p-3 rounded-lg border border-secondary/30"
              >
                <span className="font-bold block mb-1 text-foreground neon-purple-glow">Explanation:</span>
                {question.explanation}
              </motion.div>
            )}

            {isAnswered && currentIdx < quiz.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleNext}
                className="mt-4 w-full flex items-center justify-center gap-2 p-3 text-sm font-medium rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition-colors shrink-0 neon-purple-glow"
              >
                Next Question <ArrowRight className="size-4" />
              </motion.button>
            )}
            
            {isAnswered && currentIdx === quiz.length - 1 && !isSubmitted && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleSubmit}
                className="mt-6 w-full flex items-center justify-center gap-2 p-3 text-sm font-medium rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--ring))] text-primary-foreground glow-primary transition-colors shrink-0"
              >
                Submit Assessment ({correctAnswers}/{quiz.length})
              </motion.button>
            )}
            
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex flex-col items-center justify-center gap-2 p-4 text-sm font-medium rounded-lg bg-tertiary/20 text-tertiary border border-tertiary/30 shrink-0"
              >
                <span>Score: {correctAnswers}/{quiz.length}</span>
                <span className="text-xs text-tertiary/70">
                  {Math.round((correctAnswers / quiz.length) * 100)}% correct
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

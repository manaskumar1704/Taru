"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { LessonHistoryItem } from "@/hooks/useLocalHistory"
import { TrendingUp, Target, Award, AlertCircle } from "lucide-react"

interface ProgressModalProps {
  isOpen: boolean
  onClose: () => void
  history: LessonHistoryItem[]
}

interface AnalysisResult {
  learningTrend: string
  strengths: string[]
  focusAreas: string[]
}

export function ProgressModal({ isOpen, onClose, history }: ProgressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const sessions = history.map((h) => ({
        topic: h.topic,
        grade: h.grade,
        quizScore: h.quizScore,
      }))

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze progress")
      }

      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const hasScoredSessions = history.some((h) => h.quizScore !== null)

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Learning Progress
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {!hasScoredSessions && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Complete more quizzes to see your learning progress.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4 bg-accent" />
              <Skeleton className="h-4 w-full bg-accent" />
              <Skeleton className="h-4 w-5/6 bg-accent" />
              <div className="pt-4">
                <Skeleton className="h-5 w-1/2 bg-accent mb-3" />
                <Skeleton className="h-16 w-full bg-accent rounded-lg" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-5 w-1/2 bg-accent mb-3" />
                <Skeleton className="h-16 w-full bg-accent rounded-lg" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {analysis && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-accent/30 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-4 text-primary" />
                  <span className="text-xs font-bold tracking-wider text-primary uppercase">
                    Learning Trend
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {analysis.learningTrend}
                </p>
              </div>

              {analysis.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="size-4 text-tertiary" />
                    <span className="text-xs font-bold tracking-wider text-tertiary uppercase">
                      Strengths
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strengths.map((strength, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-3 py-1.5 rounded-full bg-tertiary/20 text-tertiary text-xs font-medium border border-tertiary/30"
                      >
                        {strength}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.focusAreas.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="size-4 text-secondary" />
                    <span className="text-xs font-bold tracking-wider text-secondary uppercase">
                      Focus Areas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.focusAreas.map((area, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (analysis.strengths.length + i) * 0.1 }}
                        className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium border border-secondary/30"
                      >
                        {area}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
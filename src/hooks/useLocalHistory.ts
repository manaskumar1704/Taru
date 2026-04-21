import { useState, useEffect } from "react"

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface LessonResponse {
  summary: string
  keyPoints: string[]
  quiz: QuizQuestion[]
}

export interface LessonHistoryItem {
  id: string
  topic: string
  grade: string
  timestamp: number
  quizScore: { correct: number; total: number } | null
  data: LessonResponse
}

const STORAGE_KEY = "taru-lesson-history"

export function useLocalHistory() {
  const [history, setHistory] = useState<LessonHistoryItem[]>([])

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e)
    }
  }, [])

  const addLesson = (topic: string, grade: string, data: LessonResponse): LessonHistoryItem => {
    const newItem: LessonHistoryItem = {
      id: crypto.randomUUID(),
      topic,
      grade,
      timestamp: Date.now(),
      quizScore: null,
      data,
    }

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 3) // Keep only last 3
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save history to localStorage", e)
      }
      return updated
    })
    return newItem
  }

  const clearHistory = () => {
    setHistory([])
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const updateLessonScore = (id: string, score: { correct: number; total: number }) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quizScore: score } : item
      )
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to update lesson score in localStorage", e)
      }
      return updated
    })
  }

  return { history, addLesson, clearHistory, updateLessonScore }
}

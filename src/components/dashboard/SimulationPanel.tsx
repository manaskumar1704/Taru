"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface SimulationPanelProps {
  topic: string
  grade: string
  isLoading: boolean
  error: string | null
  onTopicChange: (value: string) => void
  onGradeChange: (value: string) => void
  onSubmit: () => void
}

export function SimulationPanel({
  topic,
  grade,
  isLoading,
  error,
  onTopicChange,
  onGradeChange,
  onSubmit,
}: SimulationPanelProps) {
  const isSubmitDisabled = !topic || !grade || isLoading

  return (
    <div className="glass ghost-border rounded-2xl p-6 flex flex-col gap-6">
      <div className="space-y-1">
        <div className="text-xs font-bold tracking-wider text-primary uppercase neon-cyan-glow">Simulation Variables</div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Configure Parameters</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Topic to Synthesize</label>
          <Input
            placeholder="e.g. Quantum Mechanics, Photosynthesis"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            disabled={isLoading}
            className="input-void h-12 bg-input/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium">Target Demographic (Grade Level)</label>
          <Select value={grade} onValueChange={(val) => onGradeChange(val || "")} disabled={isLoading}>
            <SelectTrigger className="h-12 bg-input/50 border-transparent input-void rounded-lg">
              <SelectValue placeholder="Select a grade level..." />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                <SelectItem key={g} value={`Grade ${g}`}>
                  Grade {g}
                </SelectItem>
              ))}
              <SelectItem value="College">College / University</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="relative mt-4 flex w-full items-center justify-center h-12 rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--ring))] text-primary-foreground font-heading font-semibold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Synthesizing...
            </>
          ) : (
            "Generate Lesson"
          )}
        </button>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-destructive/10 border-destructive/20">
            <AlertDescription className="text-destructive font-medium">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

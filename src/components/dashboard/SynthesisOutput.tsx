import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { cardVariants } from "@/app/page"

interface SynthesisOutputProps {
  summary: string | null
  isLoading: boolean
}

export function SynthesisOutput({ summary, isLoading }: SynthesisOutputProps) {
  return (
    <motion.div 
      variants={cardVariants}
      className="glass ghost-border rounded-2xl p-6 h-full flex flex-col gap-4"
    >
      <div className="space-y-1">
        <div className="text-xs font-bold tracking-wider text-primary uppercase neon-cyan-glow">Synthesis Output</div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">Analysis Summary</h2>
      </div>

      <div className="flex-1 mt-2">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-accent" />
            <Skeleton className="h-4 w-[90%] bg-accent" />
            <Skeleton className="h-4 w-[60%] bg-accent" />
          </div>
        ) : summary ? (
          <p className="text-base text-muted-foreground leading-relaxed">{summary}</p>
        ) : (
          <div className="h-full flex items-center justify-center min-h-[100px]">
            <p className="text-muted-foreground/50 italic text-sm">Run a simulation to generate synthesis data.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { cardVariants } from "@/app/page"

interface CriticalVectorsProps {
  keyPoints: string[] | null
  isLoading: boolean
}

export function CriticalVectors({ keyPoints, isLoading }: CriticalVectorsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      variants={cardVariants}
      className="glass ghost-border rounded-2xl p-6 flex flex-col gap-4 h-[400px] overflow-hidden flex-1"
    >
      <div className="space-y-1 shrink-0">
        <div className="text-xs font-bold tracking-wider text-primary uppercase neon-cyan-glow">Critical Vectors</div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">Key Concepts</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 mt-2">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-6 w-6 rounded-md bg-accent shrink-0" />
                <Skeleton className="h-4 w-full bg-accent mt-1" />
              </div>
            ))}
          </div>
        ) : keyPoints ? (
          <motion.ul 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 flex flex-col"
          >
            {keyPoints.map((point, index) => (
              <motion.li key={index} variants={item} className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary border border-primary/40 neon-cyan-glow">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed pt-0.5">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="h-full flex items-center justify-center min-h-[100px]">
            <p className="text-muted-foreground/50 italic text-sm">Awaiting simulation data.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

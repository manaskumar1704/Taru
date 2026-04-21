import { LessonHistoryItem } from "@/hooks/useLocalHistory"
import { Plus, LayoutDashboard, BookOpen, BarChart3, Settings as SettingsIcon } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { UserProfileConfig } from "./UserProfileConfig"

interface SidebarProps {
  history: LessonHistoryItem[]
  onSelectLesson: (lesson: LessonHistoryItem) => void
  onNewSimulation: () => void
}

export function Sidebar({ history, onSelectLesson, onNewSimulation }: SidebarProps) {
  return (
    <aside className="w-[260px] flex-col border-r border-border bg-muted/30 p-4 h-full hidden md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8 px-2 mt-2">
        <h1 className="font-heading text-display-lg font-bold tracking-tight text-foreground text-2xl">
          TARU<span className="text-primary">.</span>
        </h1>
      </div>

      <div className="mb-6">
        <UserProfileConfig />
      </div>

      {/* New Simulation CTA */}
      <button
        onClick={onNewSimulation}
        className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--ring))] p-3 text-sm font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        New Simulation
      </button>

      {/* Main Nav */}
      <nav className="space-y-1 mb-8 text-sm">
        <a href="#" className="flex items-center gap-3 rounded-lg bg-accent/50 text-primary px-3 py-2 font-medium">
          <div className="w-1 h-4 bg-primary rounded-full absolute left-4" />
          <LayoutDashboard className="size-4" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent/30 transition-colors font-medium">
          <BookOpen className="size-4" />
          Lessons
        </a>
        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent/30 transition-colors font-medium">
          <BarChart3 className="size-4" />
          Progress
        </a>
      </nav>

      {/* History */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="mb-3 px-3 text-xs font-bold tracking-wider text-primary uppercase">
          Recent Simulations
        </h2>
        {history.length === 0 ? (
          <div className="px-3 text-sm text-muted-foreground">No history yet</div>
        ) : (
          <div className="space-y-1">
            {history.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className="flex w-full flex-col items-start gap-1 rounded-lg p-3 text-left transition-colors hover:bg-accent/40"
              >
                <div className="truncate w-full font-heading text-sm font-semibold">{lesson.topic}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-secondary/20 px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                    {lesson.grade}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(lesson.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between px-2">
        <ThemeToggle />
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
          <SettingsIcon className="size-4" />
        </button>
      </div>
    </aside>
  )
}

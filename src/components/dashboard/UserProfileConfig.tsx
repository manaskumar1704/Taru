"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Settings } from "lucide-react"

export function UserProfileConfig() {
  const [name, setName] = useState("Manas Kumar")
  const [isMounted, setIsMounted] = useState(false)
  const [open, setOpen] = useState(false)

  // Load from local storage
  useEffect(() => {
    setIsMounted(true)
    const stored = window.localStorage.getItem("taru-user-name")
    if (stored) setName(stored)
  }, [])

  const saveName = (e: React.FormEvent) => {
    e.preventDefault()
    window.localStorage.setItem("taru-user-name", name)
    setOpen(false)
  }

  if (!isMounted) return <div className="flex h-[52px] items-center gap-3 px-2" />

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MK"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-bold">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-heading text-sm font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground">Student</div>
          </div>
          <Settings className="size-4 text-muted-foreground shrink-0 opacity-50" />
        </button>
      } />
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading">Configure Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={saveName} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Display Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-void rounded-none bg-input"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full font-heading font-semibold tracking-wide glow-primary">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

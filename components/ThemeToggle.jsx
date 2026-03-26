"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="rounded-full w-[32px] h-[32px] flex items-center justify-center p-0 border bg-card hover:bg-accent relative focus-visible:ring-1 focus-visible:ring-offset-0 overflow-hidden shadow-sm"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

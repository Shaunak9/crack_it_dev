'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Coding Round Module Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Failed to load Coding Round</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        There was a problem loading the coding environment. Please try refreshing.
      </p>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </div>
  )
}

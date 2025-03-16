"use client"

import { useState, useEffect } from "react"
import { mockUser } from "@/lib/mock-data"

export function useUser() {
  const [user, setUser] = useState(mockUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate loading for a more realistic experience
    setLoading(true)

    const timeout = setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  return { user, loading }
}


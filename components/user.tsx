import type React from "react"
import { LucideUser } from "lucide-react"

export function User(props: React.ComponentProps<typeof LucideUser>) {
  return <LucideUser {...props} />
}


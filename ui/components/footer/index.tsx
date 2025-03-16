"use client"

import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {

    return (
        <footer className="w-full border-t bg-background">
            <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <p className="text-sm text-muted-foreground">PS2 Homebrew Hub - Criado por desenvolvedores para desenvolvedores</p>
                    <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PS2 Homebrew Hub</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}


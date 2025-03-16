"use client"

import { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/button"

interface CodePreviewProps {
    code: string
    language: string
}

export default function CodePreview({ code, language }: CodePreviewProps) {
    const [copied, setCopied] = useState(false)
    const [displayCode, setDisplayCode] = useState("")

    useEffect(() => {
        const lines = code.split("\n")
        const truncated = lines.slice(0, 20).join("\n")
        setDisplayCode(truncated)
    }, [code])

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative">
            <div className="absolute right-2 top-2 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <div className="rounded-md overflow-hidden pt-8">
                <SyntaxHighlighter
                    language={language || "c"}
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.9rem",
                        maxHeight: "400px",
                    }}
                >
                    {displayCode}
                </SyntaxHighlighter>
            </div>
        </div>
    )
}


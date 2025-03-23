"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Clock } from "lucide-react"
import type { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { ptBR } from "date-fns/locale"

interface SnippetCardProps {
    snippet: Snippet
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <>
            {snippet &&
                <Link href={`/snippets/${snippet.pid}`}>
                    <Card
                        className={`h-full transition-all duration-300 ${isHovered ? "shadow-md transform -translate-y-1" : ""} snippet-card-gradient`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-1">{snippet.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{snippet.description}</p>
                                </div>
                                <Badge variant="outline" className="ml-2 shrink-0">
                                    {snippet.language}
                                </Badge>
                            </div>
                            <div className="bg-muted/50 rounded-md p-3 overflow-hidden code-snippet">
                                <pre className="text-xs line-clamp-3">
                                    <code>{snippet.code?.substring(0, 150)}...</code>
                                </pre>
                            </div>
                        </CardContent>
                        <CardFooter className="px-6 py-4 border-t flex justify-between">
                            <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={snippet.creator?.avatarUrl} />
                                    <AvatarFallback>{snippet.creator?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{snippet.creator?.username}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground capitalize">
                                <Clock className="h-3 w-3 mr-1" />
                                {snippet.createdAt && formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true, locale: ptBR })}
                            </div>
                        </CardFooter>
                    </Card>
                </Link>}
        </>
    )
}


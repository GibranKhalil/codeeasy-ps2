"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { mockSnippets } from "@/lib/mock-data"

import { Copy, Clock, ArrowLeft, Edit, Trash, Check, Maximize, Minimize } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useAuth } from "@/hooks/use-auth"
import { Snippet } from "@/lib/types"

export default function SnippetPage() {
  const params = useParams()
  const router = useRouter()

  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    const foundSnippet = mockSnippets.find((s) => s.id === params.id)
    setSnippet(foundSnippet || null)
    setLoading(false)

    return
  }, [params.id])

  const handleCopyCode = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = async () => {
    if (!snippet || !user || user.id !== Number(snippet.user_id)) return

    if (window.confirm("Tem certeza que deseja excluir este snippet")) {
      console.log("Deleting snippet:", snippet.id)
      router.push("/snippets")
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Snippet not found</h1>
      </div>
    )
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "container py-8"}`}>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {user && user.id === Number(snippet.user_id) && (
            <>
              <Button variant="outline" asChild>
                <a href={`/snippets/${snippet.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </a>
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </>
          )}
          <Button variant="outline" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{snippet.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{snippet.description}</p>
            </div>
            <Badge variant="outline" className="self-start md:self-auto">
              {snippet.language}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code">
            <TabsList className="mb-4">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="relative">
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
              <div className="rounded-md overflow-hidden">
                <SyntaxHighlighter
                  language={snippet.language || "c"}
                  style={vscDarkPlus}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.375rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {snippet.code || ""}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm">Preview not available for this language.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={snippet.user?.avatar_url} />
              <AvatarFallback>{snippet.user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{snippet.user?.username}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


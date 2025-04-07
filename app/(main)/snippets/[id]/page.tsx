"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Copy, Clock, ArrowLeft, Edit, Trash, Check, Maximize, Minimize } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { snippetService } from "@/data/services/snippets/snippets.service"
import { AxiosResponse } from "axios"
import { Interactions } from "@/data/@types/interactions.type"

export default function SnippetPage() {
  const params = useParams()
  const router = useRouter()

  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { user } = useAuth()
  const { id } = params

  const fetchSnippet = useCallback(async () => {
    const response = await snippetService.find({ subEndpoint: `/pid/${id}` }) as unknown as AxiosResponse<Snippet>
    setSnippet(response.data || null)
  }, [id])

  const interactWithSnippet = async (type: keyof Interactions) => {
    await snippetService.addInteraction(id as string, { type })
  }

  useEffect(() => {
    interactWithSnippet("views")
  }, [id])


  useEffect(() => {
    fetchSnippet()
    setLoading(false)

    return
  }, [fetchSnippet])

  const handleCopyCode = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = async () => {
    if (!snippet || !user || user.id !== Number(snippet.creator.id)) return

    if (window.confirm("Tem certeza que deseja excluir este snippet")) {
      console.log("Deleting snippet:", snippet.id)
      router.push("/snippets")
    }
  }

  function openFullscreen(elem: HTMLElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }


  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  function toggleFullscreen() {
    const elem = document.getElementById("codeViewer") as HTMLElement;
    if (!document.fullscreenElement) {
      openFullscreen(elem);
      setIsFullscreen(true)
    } else {
      setIsFullscreen(false)
      closeFullscreen();
    }
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
        <h1 className="text-2xl font-bold">Snippet não encontrado</h1>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex gap-2">
          {user && user.id === Number(snippet.creator.id) && (
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
        <CardContent id="codeViewer" className={`bg-[#111111] p-0 h-4/5 max-h-[500px] flex flex-col ${!isFullscreen ? 'relative overflow-auto' : 'overflow-hidden'}`}>
          <div className={`flex justify-end items-center gap-2 sticky ${!isFullscreen ? 'mr-4 top-2' : 'p-4 border-b  top-0 bg-[#111111]'}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              {!isFullscreen ? <Maximize size={18} /> : <Minimize size={18} />}
            </Button>
          </div>
          <div className="h-full px-4">
            <Highlight
              theme={themes.oneDark}
              code={snippet.code}
              language={snippet.language || 'javascript'}
            >
              {({ style, tokens, getLineProps, getTokenProps }) => (
                <pre style={{
                  ...style, height: '100%', width: '100%', overflow: 'auto', scrollbarWidth: "thin",
                  scrollbarColor: "#393A40 #1E1E1E", background: 'transparent'
                }} className="overflow-y-auto">
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="mr-6 select-none">{i + 1}</span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={snippet.creator.avatarUrl} />
              <AvatarFallback>{snippet.creator.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{snippet.creator.username}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


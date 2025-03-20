"use client"

import type React from "react"

import { useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Textarea } from "@/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { useUser } from "@/lib/use-user"
import { ArrowLeft, Save } from "lucide-react"
import { CreateSnippetDto } from "@/data/@types/models/snippet/dto/create-snippet.dto"
import { User } from "@/data/@types/models/users/entities/user.entity"
import { eSnippetLanguage, languageMap } from "@/data/@types/enums/eSnippetLanguage.enum"
import { snippetService } from "@/data/services/snippets/snippets.service"
import Validator from "@/data/utils/validator.utils"
import { enginesMap, eSnippetEngine } from "@/data/@types/enums/eSnippetEngine.enum"

const newSnippetInitialData: CreateSnippetDto = {
  code: '',
  creator: new User(),
  description: '',
  language: eSnippetLanguage.Js,
  title: '',
  engine: ''
}

type SnippetAction =
  | { type: "SET_FIELD"; field: keyof CreateSnippetDto; value: string }
  | { type: "RESET" };

const snippetReducer = (state: CreateSnippetDto, action: SnippetAction): CreateSnippetDto => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return newSnippetInitialData;
    default:
      return state;
  }
};

export default function CreateSnippetPage() {
  const router = useRouter()

  const { user, loading } = useUser()
  const [snippet, setSnippet] = useReducer(snippetReducer, newSnippetInitialData)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!snippet.title.trim()) newErrors.title = "Título é obrigatório"
    if (!snippet.description.trim()) newErrors.description = "Descrição é obrigatório"
    if (!snippet.language) newErrors.language = "Linguagem é obrigatório"
    if (!snippet.code.trim()) newErrors.code = "Código é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSaving(true)

      const response = await snippetService.create(snippet, { requiresAuth: true })

      if (Validator.required(response)) {
        router.push('/snippets')
      }

    } catch (error) {
      console.error("Error creating snippet:", error)
      setIsSaving(false)
    }
    finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Snippet</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={snippet.title}
                onChange={(e) => setSnippet({ field: 'title', type: "SET_FIELD", value: e.target.value })}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={snippet.description}
                onChange={(e) => setSnippet({ field: 'description', type: 'SET_FIELD', value: e.target.value })}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="language">Linguagem <span className="text-destructive">*</span></Label>
                <Select value={snippet.language} onValueChange={(e) => setSnippet({ field: 'language', type: 'SET_FIELD', value: e })}>
                  <SelectTrigger id="language" className={errors.language ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione a linguagem utilizada" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(eSnippetLanguage).map((lang, index) => (
                      <SelectItem key={index} value={lang}>
                        {languageMap.get(lang)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && <p className="text-sm text-destructive">{errors.language}</p>}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="engine">Engine <span className="text-destructive">*</span></Label>
                <Select value={snippet.engine} onValueChange={(e) => setSnippet({ field: 'engine', type: 'SET_FIELD', value: e })}>
                  <SelectTrigger id="engine">
                    <SelectValue placeholder="Seleciona a engine utilizada" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(eSnippetEngine).map((eng, index) => (
                      <SelectItem key={index} value={eng}>
                        {enginesMap.get(eng)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código <span className="text-destructive">*</span></Label>
              <Textarea
                id="code"
                value={snippet.code}
                onChange={(e) => setSnippet({ field: 'code', type: 'SET_FIELD', value: e.target.value })}
                className={`font-mono min-h-[300px] ${errors.code ? "border-destructive" : ""}`}
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving} className="gap-2">
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


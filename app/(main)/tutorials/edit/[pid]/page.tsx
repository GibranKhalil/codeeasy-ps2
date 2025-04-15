"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Textarea } from "@/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Badge } from "@/components/badge"
import { Separator } from "@/components/separator"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import {
    ArrowLeft,
    Upload,
    ImageIcon,
    X,
    Tag,
    Info,
    FileText,
    Save,
    Eye,
    Loader2,
    Clock,
    BookOpen,
    Code,
    User,
} from "lucide-react"
import { categoriesService } from "@/data/services/categories/categories.service"
import { Category } from "@/data/@types/models/categories/entities/category.entity"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTutorialForm } from "@/hooks/tutorials/use-createTutorial"
import { useAuth } from "@/hooks/use-auth"
import { tutorialsService } from "@/data/services/tutorials/tutorials.service"
import { AxiosResponse } from "axios"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

export default function EditTutorialPage() {
    const { pid } = useParams() as { pid: string }
    const router = useRouter()
    const { toast } = useToast()
    const { isLoadingUser, user } = useAuth()

    // State management
    const [activeTab, setActiveTab] = useState('details')
    const [previewMode, setPreviewMode] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tutorial, setTutorial] = useState<Tutorial>()
    const [categories, setCategories] = useState<Category[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    const coverImageInputRef = useRef<HTMLInputElement>(null)

    // Form handling
    const {
        setCategory,
        setContent,
        setCoverImage,
        setExcerpt,
        setReadTime,
        setTags,
        setTitle,
        state,
        setForm,
    } = useTutorialForm()

    // Data fetching
    const { isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await categoriesService.find()
            setCategories(response.data.data)
            return response.data
        },
    })

    const {
        isLoading: isLoadingTutorial,
        isError: tutorialError
    } = useQuery({
        queryKey: ['tutorial', pid],
        queryFn: async () => {
            const response = await tutorialsService.find({
                subEndpoint: `/pid/${pid}`,
            }) as unknown as AxiosResponse<Tutorial>

            setTutorial(response.data)
            setForm({
                ...response.data,
                categoryId: response.data.category.id,
                coverImage: null,
                creatorId: response.data.creator.id,
            })

            return response.data
        },
        enabled: !!pid,
    })

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!state.title.trim()) newErrors.title = 'Título é obrigatório'
        if (!state.excerpt.trim()) newErrors.excerpt = 'Descrição é obrigatória'
        if (!state.categoryId) newErrors.category = 'Categoria é obrigatória'
        if (!state.readTime) newErrors.readTime = 'Tempo de leitura é obrigatório'
        if (!state.content.trim()) newErrors.content = 'Conteúdo é obrigatório'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Form submission
    const mutation = useMutation({
        mutationFn: async ({ saveAsDraft = false }: { saveAsDraft?: boolean } = {}) => {
            setIsSubmitting(true)

            const formData = new FormData()
            formData.append('title', state.title)
            formData.append('excerpt', state.excerpt)
            formData.append('categoryId', `${state.categoryId}`)
            formData.append('readTime', `${state.readTime}`)
            formData.append('content', state.content)
            formData.append('creatorId', `${user?.id}`)

            if (state.coverImage) {
                formData.append('coverImage', state.coverImage as File)
            }

            if (state.tags?.length) {
                formData.append('tags', state.tags.join(','))
            }

            return await tutorialsService.update(Number(tutorial?.id), formData, {
                requiresAuth: true,
                customHeaders: { 'Content-Type': 'multipart/form-data' },
                params: { creator: user?.id },
            })
        },
        onSuccess: (_, variables) => {
            toast({
                title: variables?.saveAsDraft
                    ? 'Rascunho salvo com sucesso'
                    : 'Tutorial atualizado com sucesso',
                description: variables?.saveAsDraft
                    ? 'Seu tutorial foi salvo como rascunho.'
                    : 'Seu tutorial foi atualizado com sucesso.',
            })
            router.push('/tutorials')
        },
        onError: (error: Error) => {
            console.error('Erro ao atualizar tutorial:', error)
            toast({
                title: 'Erro na atualização',
                description: error.message || 'Houve um erro ao atualizar seu tutorial.',
                variant: 'destructive',
            })
        },
        onSettled: () => {
            setIsSubmitting(false)
        },
    })

    const handleSubmit = (e: React.FormEvent, saveAsDraft = false) => {
        e.preventDefault()

        if (!validateForm()) {
            toast({
                title: 'ERRO',
                description: 'Por favor, resolva os erros antes de enviar novamente.',
                variant: 'destructive',
            })
            return
        }

        mutation.mutate({ saveAsDraft })
    }

    // Loading state
    if (isLoadingTutorial || isLoadingCategories || isLoadingUser) {
        return (
            <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-16rem)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (tutorialError) {
        return (
            <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-16rem)]">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-destructive">Erro ao carregar o tutorial</p>
                </div>
            </div>
        )
    }


    return (
        <div className="container py-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>
                        <h1 className="text-3xl font-bold">Editar Tutorial</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={previewMode ? "default" : "outline"}
                            onClick={() => setPreviewMode(!previewMode)}
                            disabled={isSubmitting}
                        >
                            {previewMode ? (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Editar
                                </>
                            ) : (
                                <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Pré-visualizar
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    {previewMode ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Pré-Visualização</CardTitle>
                                <CardDescription>Isto é como seu tutorial vai aparecer para os usuários</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {state.coverImage && (
                                    <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden">
                                        <Image
                                            src={URL.createObjectURL(state.coverImage) || "/placeholder.svg"}
                                            alt={state.title || "Tutorial cover"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        {state.categoryId && <Badge className="bg-primary">{state.categoryId}</Badge>}
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {state.readTime} minutos de leitura
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold">{state.title || "Título do Tutorial"}</h1>
                                    <p className="text-xl text-muted-foreground">{state.excerpt || "A descrição do tutorial vai aparecer aqui"}</p>
                                </div>

                                {state.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {state.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <Separator />

                                <div className="markdown max-w-none">
                                    <ReactMarkdown>{state.content || "O conteúdo do tutorial aparecerá aqui"}</ReactMarkdown>
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-8 border-t">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user?.username || "Anonymous"}</p>
                                            <p className="text-sm text-muted-foreground">Autor</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-6 w-full justify-start">
                                    <TabsTrigger value="details" className="flex items-center gap-1.5">
                                        <Info className="h-4 w-4" />
                                        Informações Básicas
                                    </TabsTrigger>
                                    <TabsTrigger value="media" className="flex items-center gap-1.5">
                                        <ImageIcon className="h-4 w-4" />
                                        Imagem de Capa
                                    </TabsTrigger>
                                    <TabsTrigger value="content" className="flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        Conteúdo
                                    </TabsTrigger>
                                </TabsList>

                                <Card>
                                    <TabsContent value="details" className="m-0">
                                        <CardHeader>
                                            <CardTitle>Informações Básicas</CardTitle>
                                            <CardDescription>Informe as informações básicas do seu tutorial</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">
                                                    Título <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={state.title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Título do tutorial"
                                                    className={errors.title ? "border-destructive" : ""}
                                                />
                                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="excerpt">
                                                    Descrição <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="excerpt"
                                                    value={state.excerpt}
                                                    onChange={(e) => setExcerpt(e.target.value)}
                                                    placeholder="Forneça um resumo do seu tutorial (max 200 characteres)"
                                                    className={errors.excerpt ? "border-destructive" : ""}
                                                    maxLength={200}
                                                />
                                                {errors.excerpt ? (
                                                    <p className="text-sm text-destructive">{errors.excerpt}</p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground text-right">{state.excerpt.length}/200 characters</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">
                                                        Categoria <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select value={`${state.categoryId}`} onValueChange={(e) => setCategory(Number(e))}>
                                                        <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                                                            <SelectValue placeholder="Selecione uma categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((cat, index) => (
                                                                <SelectItem key={index} value={`${cat.id}`}>
                                                                    {cat.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tags">Tags</Label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="tags"
                                                            value={state.tags.join(',')}
                                                            onChange={(e) => setTags([e.target.value])}
                                                            placeholder="e.g. graphics, beginner, ps2dev (separe por vírgula)"
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Separe as tags com vírgulas</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="readTime">
                                                    Tempo de leitura estimado (minutos) <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="readTime"
                                                    type="number"
                                                    value={state.readTime}
                                                    onChange={(e) => setReadTime(Number(e.target.value))}
                                                    placeholder="e.g. 10"
                                                    className={errors.readTime ? "border-destructive" : ""}
                                                    min="1"
                                                    max="60"
                                                />
                                                {errors.readTime && <p className="text-sm text-destructive">{errors.readTime}</p>}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button variant="ghost" onClick={() => router.back()} type="button">
                                                Cancelar
                                            </Button>
                                            <Button type="button" onClick={() => setActiveTab("media")}>
                                                Próximo: Imagem de Capa
                                            </Button>
                                        </CardFooter>
                                    </TabsContent>

                                    <TabsContent value="media" className="m-0">
                                        <CardHeader>
                                            <CardTitle>Imagem de Capa</CardTitle>
                                            <CardDescription>Coloque uma Imagem como capa do seu tutorial</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label>
                                                    Imagem de Capa <span className="text-destructive">*</span>
                                                </Label>
                                                <div
                                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${errors.coverImage ? "border-destructive" : "border-border"}`}
                                                    onClick={() => coverImageInputRef.current?.click()}
                                                >
                                                    {(state.coverImage || tutorial?.coverImage_url) ? (
                                                        <div className="relative w-full aspect-video">
                                                            <Image
                                                                src={
                                                                    state.coverImage
                                                                        ? URL.createObjectURL(state.coverImage)
                                                                        : tutorial?.coverImage_url || "/placeholder.svg"
                                                                }
                                                                alt="Cover image"
                                                                fill
                                                                className="object-cover rounded-md"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCoverImage(null);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                            <p className="text-sm text-muted-foreground mb-1">Clique para enviar uma imagem de capa</p>
                                                            <p className="text-xs text-muted-foreground">PNG, JPG (Recomendado: 1200x600px)</p>
                                                        </>
                                                    )}
                                                    <input
                                                        ref={coverImageInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null;
                                                            setCoverImage(file);
                                                        }}
                                                    />
                                                </div>

                                                {errors.coverImage && <p className="text-sm text-destructive">{errors.coverImage}</p>}
                                            </div>

                                            <div className="rounded-lg bg-muted p-4">
                                                <h3 className="text-sm font-medium mb-2">Imagem de Capa Tips</h3>
                                                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                                                    <li>Use uma imagem de alta qualidade que represente o conteúdo do tutorial.</li>
                                                    <li>Dimensões recomendadas: 1200x600 pixels (proporção 2:1).</li>
                                                    <li>Mantenha os elementos importantes centralizados, pois a imagem pode ser cortada em diferentes dispositivos.</li>
                                                    <li>Evite texto na imagem, pois ele pode se tornar ilegível quando reduzido.</li>
                                                </ul>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <Button variant="ghost" type="button" onClick={() => setActiveTab("details")}>
                                                Anterior: Informações
                                            </Button>
                                            <Button type="button" onClick={() => setActiveTab("content")}>
                                                Próximo: Conteúdo
                                            </Button>
                                        </CardFooter>
                                    </TabsContent>

                                    <TabsContent value="content" className="m-0">
                                        <CardHeader>
                                            <CardTitle>Conteúdo</CardTitle>
                                            <CardDescription>Escreva o conteúdo do tutorial usando Markdown</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="content">
                                                    Conteúdo <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="content"
                                                    value={state.content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    placeholder="# Introdução ao desenvolvimento do PS2
  
  ## Introdução
  
  Bem-vindo ao desenvolvimento homebrew do PS2! Este tutorial irá guiá-lo através de...
  
  ## Pré-requisitos
  
  - Item 1
  - Item 2
  
  ## Etapa 1: Configurando seu ambiente
  
  Instruções detalhadas aqui..."
                                                    className={`min-h-[400px] font-mono ${errors.content ? "border-destructive" : ""}`}
                                                />
                                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                            </div>

                                            <div className="rounded-lg bg-muted p-4">
                                                <h3 className="text-sm font-medium mb-2">Dicas Markdown</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Code className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-medium">Formatando</span>
                                                        </div>
                                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                                                            <li>
                                                                <code># Título 1</code> para os títulos principais
                                                            </li>
                                                            <li>
                                                                <code>## Títutlo 2</code> para os subtítulos
                                                            </li>
                                                            <li>
                                                                <code>**texto em negrito**</code> for <strong>texto em negrito</strong>
                                                            </li>
                                                            <li>
                                                                <code>*texto em itálico*</code> for <em>texto em itálico</em>
                                                            </li>
                                                            <li>
                                                                <code>[Texto do link](url)</code> para links
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-medium">Listas & Código</span>
                                                        </div>
                                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                                                            <li>
                                                                <code>- Item</code> para listas com marcadores
                                                            </li>
                                                            <li>
                                                                <code>1. Item</code> para listas numeradas
                                                            </li>
                                                            <li>
                                                                <code>\`\`\`c</code> e <code>\`\`\`</code> para blocos de código
                                                            </li>
                                                            <li>
                                                                <code>`código embutido`</code> para <code>código embutido</code>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" type="button" onClick={() => setActiveTab("media")}>
                                                    Anterior: Imagem
                                                </Button>
                                            </div>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="mr-2 h-4 w-4" />
                                                )}
                                                Publicar Tutorial
                                            </Button>
                                        </CardFooter>
                                    </TabsContent>
                                </Card>
                            </Tabs>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}
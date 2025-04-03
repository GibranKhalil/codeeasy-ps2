"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  X,
  Plus,
  Gamepad2,
  Tag,
  Info,
  FileText,
  Save,
  Eye,
  Loader2,
  Download,
  Code,
  BookOpen,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/hooks/use-auth"
import Validator from "@/data/utils/validator.utils"
import { gameService } from "@/data/services/games/game.service"
import { useGameForm } from "@/hooks/games/use-createGame"
import { containerVariants, itemVariants } from "@/components/framerVariants/games/create"
import { categoriesService } from "@/data/services/categories/categories.service"
import { Category } from "@/data/@types/models/categories/entities/category.entity"


// const SUPPORTED_FORMATS = [
//   { extension: "iso", description: "Imagem ISO" },
//   { extension: "cso", description: "ISO Comprimido" },
//   { extension: "chd", description: "Compressed Hunks of Data" },
//   { extension: "isz", description: "Compressed ISO Image" },
//   { extension: "bin", description: "Binary Image" },
//   { extension: "elf", description: "Executable and Linkable Format" },
// ]

export default function SubmitGamePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoadingUser } = useAuth()
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  // const [uploadProgress, setUploadProgress] = useState(0)
  // const [isUploading, setIsUploading] = useState(false)

  const {
    state,
    setTitle,
    setDescription,
    setCategory,
    setTags,
    setVersion,
    setSizeMb,
    setContent,
    setCoverImage,
    addScreenshot,
    removeScreenshot,
    setGameLink,
  } = useGameForm();

  // const [gameFile, setGameFile] = useState<File | null>(null)

  const coverImageInputRef = useRef<HTMLInputElement>(null)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoadingUser && !Validator.required(user)) {
      router.push("/")
      return
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!state.title.trim()) newErrors.title = "Título é obrigatório"
    if (!state.excerpt.trim()) newErrors.description = "Descrição é obrigatório"
    if (!state.categoryId) newErrors.category = "Categoria é obrigatório"
    if (!state.version.trim()) newErrors.version = "Versão é obrigatório"
    if (!state.fileSize) newErrors.sizeMb = "Tamanho do Arquivo é obrigatório"
    if (!state.description.trim()) newErrors.content = "Conteúdo é obrigatório"
    if (!state.coverImage) newErrors.coverImage = "Imagem de capa é obrigatório"
    if (state.screenshots.length === 0) newErrors.screenshots = "Pelo menos uma screenshot é obrigatório"
    if (!state.game_url) newErrors.gameLink = "Link de downLoad é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverImage: "Image deve ter menos que 5MB" }))
        return
      }

      setCoverImage(file)
      setErrors((prev) => ({ ...prev, coverImage: "" }))
    }
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo é muito grande",
          description: "Screenshot deve ter menos que 5MB",
          variant: "destructive",
        })
        return
      }

      addScreenshot(file)
      setErrors((prev) => ({ ...prev, screenshots: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Erro de validação!",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (user) {
        const formData = new FormData();
        formData.append("title", state.title);
        formData.append("excerpt", state.excerpt);
        formData.append("version", state.version);
        formData.append("fileSize", `${state.fileSize}`);
        formData.append("description", state.description);
        formData.append("coverImage", state.coverImage as File);
        formData.append("game_url", state.game_url);
        formData.append("creatorId", `${user.id}`);
        formData.append("category_id", `${state.categoryId}`);

        if (state.tags) {
          formData.append("tags", state.tags.join(","));
        }

        if (state.screenshots && state.screenshots.length > 0) {
          state.screenshots.forEach((screenshot) => {
            formData.append("screenshots", screenshot);
          });
        }

        const response = await gameService.create(formData, {
          requiresAuth: true,
          customHeaders: { "Content-Type": "multipart/form-data" },
        });

        if (response.success === true) {
          router.push('/games');
          return
        }

        toast({
          title: "Erro de envio!",
          description: "Houve um erro ao enviar seu jogo. Por favor, tente novamente",
          variant: "destructive",
        });

        return;
      }

      toast({
        title: "Jogo enviado com sucesso!",
        description: "Seu jogo foi enviando e está aguardando revisão",
      });

      router.push("/games");
    } catch (error) {
      console.error("Error submitting game:", error);
      toast({
        title: "Erro de envio!",
        description: "Houve um erro ao enviar seu jogo. Por favor, tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoadingUser) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const fetchCategories = useCallback(async () => {
    const response = await categoriesService.find({ requiresAuth: true })
    setCategories(response.data.data)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])


  // const handleGameFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     if (file.size > 100 * 1024 * 1024) {
  //       setErrors((prev) => ({ ...prev, gameFile: "File must be less than 100MB" }))
  //       return
  //     }

  //     const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""
  //     const isValidFormat = SUPPORTED_FORMATS.some((format) => format.extension === fileExtension)

  //     if (!isValidFormat) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         gameFile: `Invalid file format. Supported formats: ${SUPPORTED_FORMATS.map((f) => f.extension).join(", ")}`,
  //       }))
  //       return
  //     }

  //     setIsUploading(true)
  //     setUploadProgress(0)

  //     const interval = setInterval(() => {
  //       setUploadProgress((prev) => {
  //         if (prev >= 100) {
  //           clearInterval(interval)
  //           setIsUploading(false)
  //           setGameFile(file)
  //           setSizeMb((file.size / (1024 * 1024)).toFixed(2))
  //           setErrors((prev) => ({ ...prev, gameFile: "", sizeMb: "" }))
  //           return 100
  //         }
  //         return prev + 5
  //       })
  //     }, 200)
  //   }
  // }

  // const parsedTags = tags
  //   .split(",")
  //   .map((tag) => tag.trim())
  //   .filter((tag) => tag.length > 0)

  return (
    <div className="container py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Enviar Jogo</h1>
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
                  Pré-Visualizar
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
                <CardDescription>É assim que o envio do jogo aparecerá para os usuários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {state.coverImage && (
                  <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(state.coverImage) || "/placeholder.svg"}
                      alt={state.title || "Capa do jogo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3 mb-3">
                    {state.categoryId && <Badge className="bg-primary">{state.categoryId}</Badge>}
                    {state.version && <Badge variant="outline">v{state.version}</Badge>}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">{state.title || "Título do jogo"}</h1>
                  <p className="text-xl text-muted-foreground">{state.description || "A descrição do jogo aparecerá aqui."}</p>
                </div>

                {state.screenshots.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Screenshots</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {state.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                          <Image
                            src={URL.createObjectURL(screenshot) || "/placeholder.svg"}
                            alt={`Screenshot ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Sobre esse jogo</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{state.description || "O conteúdo do jogo aparecerá aqui."}</ReactMarkdown>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Informações do jogo</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Versão</p>
                      <p className="font-medium">{state.version || "1.0.0"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tamanho</p>
                      <p className="font-medium">{state.fileSize ? `${state.fileSize} MB` : "Unknown"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Categoria</p>
                      <p className="font-medium">{state.categoryId || "Uncategorized"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Desenvolvedor</p>
                      <p className="font-medium">{user?.username || "Anonymous"}</p>
                    </div>
                  </div>
                </div>

                {/* {parsedTags.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {parsedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )} */}

                <div className="pt-4">
                  <Button className="w-full md:w-auto" size="lg" disabled>
                    <Download className="mr-2 h-5 w-5" />
                    Baixar Jogo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger value="details" className="flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    Detalhes básicos
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4" />
                    Mídia
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Conteúdo
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-1.5">
                    <Gamepad2 className="h-4 w-4" />
                    Arquivo do jogo
                  </TabsTrigger>
                </TabsList>

                <Card>
                  <TabsContent value="details" className="m-0">
                    <CardHeader>
                      <CardTitle>Detalhes básicos</CardTitle>
                      <CardDescription>Forneça informações básicas sobre o seu jogo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Título do jogo <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={state.title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Digite o título do seu jogo"
                          className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Breve descrição <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={state.excerpt}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Forneça uma breve descrição do seu jogo (máximo de 200 caracteres)"
                          className={errors.description ? "border-destructive" : ""}
                          maxLength={200}
                        />
                        {errors.description ? (
                          <p className="text-sm text-destructive">{errors.description}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground text-right">
                            {state.excerpt.length}/200 Caracteres
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category">
                            Categoria <span className="text-destructive">*</span>
                          </Label>
                          <Select value={`${state.categoryId}`} onValueChange={(value) => setCategory(Number(value))}>
                            <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={`${cat.id}`}>
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
                              value={state.tags?.join(",")}
                              onChange={(e) => setTags([e.target.value])}
                              placeholder="e.g. platformer, 2d, puzzle (comma separated)"
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Separe as tags com vírgulas</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="version">
                            Versão <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="version"
                            value={state.version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="e.g. 1.0.0"
                            className={errors.version ? "border-destructive" : ""}
                          />
                          {errors.version && <p className="text-sm text-destructive">{errors.version}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sizeMb">
                            Tamanho do arquivo (MB) <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="sizeMb"
                            type="number"
                            value={state.fileSize}
                            onChange={(e) => setSizeMb(Number(e.target.value))}
                            placeholder="e.g. 4.2"
                            className={errors.sizeMb ? "border-destructive" : ""}
                            min="0.1"
                            step="0.1"
                          />
                          {errors.sizeMb && <p className="text-sm text-destructive">{errors.sizeMb}</p>}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" onClick={() => router.back()} type="button">
                        Cancelar
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("media")}>
                        Próximo: Mídia
                      </Button>
                    </CardFooter>
                  </TabsContent>

                  <TabsContent value="media" className="m-0">
                    <CardHeader>
                      <CardTitle>Mídia</CardTitle>
                      <CardDescription>Carregue a imagem da capa e as capturas de tela do seu jogo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>
                          Imagem da capa <span className="text-destructive">*</span>
                        </Label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${errors.coverImage ? "border-destructive" : "border-border"
                            }`}
                          onClick={() => coverImageInputRef.current?.click()}
                        >
                          {state.coverImage ? (
                            <div className="relative w-full aspect-video">
                              <Image
                                src={URL.createObjectURL(state.coverImage) || "/placeholder.svg"}
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
                                  e.stopPropagation()
                                  setCoverImage(null)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Clique para fazer upload da imagem da capa</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG (Recomendado: 1280x720px)</p>
                            </>
                          )}
                          <input
                            ref={coverImageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImageChange}
                          />
                        </div>
                        {errors.coverImage && <p className="text-sm text-destructive">{errors.coverImage}</p>}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>
                          Screenshots <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {state.screenshots.map((screenshot, index) => (
                            <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                              <Image
                                src={URL.createObjectURL(screenshot) || "/placeholder.svg"}
                                alt={`Screenshot ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => removeScreenshot(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          <div
                            className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => screenshotInputRef.current?.click()}
                          >
                            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Adicionar Screenshot</p>
                            <input
                              ref={screenshotInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleScreenshotChange}
                            />
                          </div>
                        </div>
                        {errors.screenshots && <p className="text-sm text-destructive">{errors.screenshots}</p>}
                        <p className="text-xs text-muted-foreground">
                          Carregue pelo menos uma captura de tela do seu jogo (Recomendado: 1280x720px)
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" type="button" onClick={() => setActiveTab("details")}>
                        Anterior: Detalhes
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("content")}>
                        Próximo: Conteúdo
                      </Button>
                    </CardFooter>
                  </TabsContent>

                  <TabsContent value="content" className="m-0">
                    <CardHeader>
                      <CardTitle>Conteúdo</CardTitle>
                      <CardDescription>Escreva informações detalhadas sobre seu jogo usando Markdown</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="content">
                          Descrição do jogo <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="content"
                          value={state.description}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="# About My Game

Describe your game in detail here. You can use Markdown formatting.

## Features

- Feature 1
- Feature 2
- Feature 3

## Controls

Explain the controls here.

## Credits

List credits here."
                          className={`min-h-[400px] font-mono ${errors.content ? "border-destructive" : ""}`}
                        />
                        {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-muted-foreground">Você pode usar o Markdown para formatar seu conteúdo</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3" />
                              <span>```c para blocos de código</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span># Título, ## Subtítulo</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              <span>*itálico*, **negrito**</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" type="button" onClick={() => setActiveTab("media")}>
                        Anterior: Mídia
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("file")}>
                        Próximo: Arquivo do jogo
                      </Button>
                    </CardFooter>
                  </TabsContent>

                  <TabsContent value="file" className="m-0">
                    <CardHeader>
                      <CardTitle>Arquivo do jogo</CardTitle>
                      <CardDescription>Carregue o arquivo do jogo para os usuários baixarem</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>
                          Link de Download do jogo <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="url"
                          value={state.game_url}
                          type="url"
                          onChange={(e) => setGameLink(e.target.value)}
                          placeholder="Informe a url de download do seu jogo"
                          className={errors.gameLink ? "border-destructive" : ""}
                        />
                        {errors.gameLink && <p className="text-sm text-destructive">{errors.gameLink}</p>}
                        {/* <div
                          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${errors.gameFile ? "border-destructive" : "border-border"
                            }`}
                          onClick={() => gameFileInputRef.current?.click()}
                        >
                          {gameFile ? (
                            <div className="flex flex-col items-center">
                              <Gamepad2 className="h-10 w-10 text-primary mb-2" />
                              <p className="font-medium mb-1">{gameFile.name}</p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {(gameFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setGameFile(null)
                                  setUploadProgress(0)
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Remover
                              </Button>
                            </div>
                          ) : isUploading ? (
                            <div className="w-full max-w-xs flex flex-col items-center">
                              <Loader2 className="h-10 w-10 text-primary mb-4 animate-spin" />
                              <p className="text-sm mb-2">Carregando arquivo do jogo...</p>
                              <Progress value={uploadProgress} className="w-full h-2 mb-1" />
                              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-1">Formatos suportados: ISO, CSO, CHDClique para fazer upload do arquivo do jogo</p>
                              <p className="text-xs text-muted-foreground mb-2">
                                Formatos suportados: ISO, CSO, CHD, ISZ, BIN, ELF (Máx.: 100 MB)
                              </p>
                              <div className="flex flex-wrap justify-center gap-1 max-w-md">
                                {SUPPORTED_FORMATS.map((format) => (
                                  <Badge key={format.extension} variant="outline" className="text-xs">
                                    .{format.extension}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                          <input
                            ref={gameFileInputRef}
                            type="file"
                            accept=".iso,.cso,.chd,.isz,.bin,.elf"
                            className="hidden"
                            onChange={handleGameFileChange}
                          />
                        </div> */}
                        {errors.gameFile && (
                          <div className="flex items-start gap-2 mt-2 text-destructive">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{errors.gameFile}</p>
                          </div>
                        )}
                      </div>

                      {/* <div className="rounded-lg bg-muted p-4">
                        <h3 className="text-sm font-medium mb-2">Informações de formato de arquivo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          {SUPPORTED_FORMATS.map((format) => (
                            <div key={format.extension} className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs w-12 justify-center">
                                .{format.extension}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{format.description}</span>
                            </div>
                          ))}
                        </div>
                      </div> */}

                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="text-sm font-medium mb-2">Diretrizes de Submissão</h3>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                          <li>Seu jogo deve ser compatível com o homebrew do PS2.</li>
                          <li>Inclua todos os arquivos necessários para que o jogo seja executado.</li>
                          <li>Forneça instruções de instalação claras em sua descrição.</li>
                          <li>Certifique-se de que seu jogo não viole nenhum direito autoral ou de propriedade intelectual.</li>
                          <li>Seu envio será analisado antes de ser publicado.</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" type="button" onClick={() => setActiveTab("content")}>
                        Anterior: Conteúdo
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enviar Jogo
                          </>
                        )}
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


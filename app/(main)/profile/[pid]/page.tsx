"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Badge } from "@/components/badge"
import { Separator } from "@/components/separator"
import SnippetCard from "@/components/snippetCard"
import {
  User,
  Code,
  Settings,
  BookOpen,
  Gamepad2,
  Github,
  Globe,
  Calendar,
  Edit,
  Loader2,
  PlusCircle,
  Activity,
  Heart,
  Download,
  Linkedin,
  FileCheck,
  ShieldCheck,
  Bookmark,
  CodeXml,
  TwitterIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Validator from "@/data/utils/validator.utils"
import type { User as UserDto } from "@/data/@types/models/users/entities/user.entity"
import { ptBR } from "date-fns/locale"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { SettingsPage } from "@/components/pages/profile/tabs/settings"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"
import { Game } from "@/data/@types/models/games/entities/game.entity"
import { TutorialCard } from "@/components/trainingCard"
import { tutorialsService } from "@/data/services/tutorials/tutorials.service"
import { snippetService } from "@/data/services/snippets/snippets.service"
import { gameService } from "@/data/services/games/game.service"
import RolesManager from "@/components/admin/rolesManager"
import SubmissionsManager from "@/components/admin/SubmissionsManager"
import { categoriesService } from "@/data/services/categories/categories.service"
import { Category } from "@/data/@types/models/categories/entities/category.entity"
import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { EditProfileDialog } from "@/components/pages/profile/dialogs/editProfileDialog"

export default function ProfilePage() {
  const router = useRouter()

  const { user, isLoadingUser } = useAuth()

  const [profile, setProfile] = useState<UserDto | null>(null)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [games, setGames] = useState<Game[]>([])

  const [newCategory, setNewCategory] = useState<string>()
  const [newCategoryError, setNewCategoryError] = useState<string>()
  const [isSubmittingCategory, setSubmittingCategory] = useState<boolean>(false)

  const [categories, setCategories] = useState<Category[]>([])

  const [loadingProfile, setLoadingProfile] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("overview")

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)

  const fetchTutorialsByCreator = useCallback(async () => {
    if (user) {
      const response = await tutorialsService.find({ requiresAuth: true, subEndpoint: `/creator/${user.id}`, params: { limit: 3 } })
      setTutorials(response.data.data)
    }
  }, [user])

  const fetchSnippetsByCreator = useCallback(async () => {
    if (user) {
      const response = await snippetService.find({ requiresAuth: true, subEndpoint: `/creator/${user.id}`, params: { limit: 3 } })
      setSnippets(response.data.data)
    }
  }, [user])

  const fetchGamesByCreator = useCallback(async () => {
    if (user) {
      const response = await gameService.find({ requiresAuth: true, subEndpoint: `/creator/${user.id}`, params: { limit: 3 } })
      setGames(response.data.data)
    }
  }, [user])

  const fetchCategories = useCallback(async () => {
    const response = await categoriesService.find()
    setCategories(response.data.data)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (user) {
      setLoadingProfile(false)
      setProfile(user)
      return
    }
  }, [user])

  useEffect(() => {
    fetchTutorialsByCreator()
    fetchSnippetsByCreator()
    fetchGamesByCreator()
    return
  }, [fetchTutorialsByCreator, fetchTutorialsByCreator, fetchGamesByCreator])

  useEffect(() => {
    if (!Validator.required(user) && !isLoadingUser) {
      router.push("/login")
    }
  }, [user, isLoadingUser, router])

  const hasAdminRole = useMemo(() => {
    return profile && profile.roles && profile.roles.map((role) => role.name.toLowerCase()).includes("admin")
  }, [profile])

  const hasModeratorRole = useMemo(() => {
    return profile && profile.roles && (profile.roles.map((role) => role.name.toLowerCase()).includes("moderator") || profile.roles.map((role) => role.name.toLowerCase()).includes("admin"))
  }, [profile])

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmittingCategory(true)
    if (newCategory && newCategory.trim() !== "") {
      const response = await categoriesService.create({ name: newCategory }, { requiresAuth: true })

      if (response.success === false) {
        setNewCategoryError(response.message)
        setSubmittingCategory(false)
        return
      }

      setNewCategory('')
      setNewCategoryError('')
      setSubmittingCategory(false)
      await fetchCategories()
      return
    }

    setNewCategoryError("A Categoria precisa de uma descrição")
    setSubmittingCategory(false)
  }


  if (isLoadingUser || loadingProfile) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando Perfil...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

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

  const totalContributions = snippets.length + tutorials.length + games.length

  return (
    <div className="container py-8">
      {isOpenEditModal &&
        <EditProfileDialog onOpenChange={setIsOpenEditModal} onClose={() => setIsOpenEditModal(false)} onSave={() => setIsOpenEditModal(false)} open={isOpenEditModal} />}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="h-32 relative">
              {profile.coverImageUrl ? (
                <img
                  src={profile.coverImageUrl}
                  alt="Imagem de capa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background"></div>
              )}
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <p className="text-muted-foreground">{profile.bio || "Nenhuma Bio escrita ainda."}</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => setIsOpenEditModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Entrou {format(new Date(profile.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                {profile && profile.github && (
                  <Link
                    href={`${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1.5" />
                    {profile.github}
                  </Link>
                )}
                {profile && profile.linkedin && (
                  <Link
                    href={`${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4 mr-1.5" />
                    {profile.linkedin}
                  </Link>
                )}
                {profile && profile.website && (
                  <Link
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-1.5" />
                    {profile.website.replace(/^https?:\/\//, "")}
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <Card className="bg-muted/40">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{snippets.length}</div>
                    <div className="text-sm text-muted-foreground">Snippets</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{tutorials.length}</div>
                    <div className="text-sm text-muted-foreground">Tutoriais</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{games.length}</div>
                    <div className="text-sm text-muted-foreground">Jogos</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{totalContributions}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="overview" className="flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="snippets" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                Snippets
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                Tutoriais
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-1.5">
                <Gamepad2 className="h-4 w-4" />
                Jogos
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
              {hasModeratorRole &&
                <TabsTrigger value="admin-submissions" className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  Submissões
                </TabsTrigger>}
              {hasModeratorRole &&
                <TabsTrigger value="admin-categories" className="flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4" />
                  Categorias
                </TabsTrigger>}
              {hasAdminRole &&
                <TabsTrigger value="admin-roles" className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Papéis
                </TabsTrigger>
              }
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atividade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {totalContributions > 0 ? (
                        <div className="space-y-4">
                          {snippets.slice(0, 2).map((snippet) => (
                            <div key={snippet.id} className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Code className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Criou um novo snippet:{" "}
                                  <Link href={`/snippets/${snippet.id}`} className="text-primary hover:underline">
                                    {snippet.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(snippet.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                          ))}

                          {tutorials.slice(0, 1).map((tutorial) => (
                            <div key={tutorial.id} className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <BookOpen className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Publicou um tutorial:{" "}
                                  <Link href={`/tutorials/${tutorial.pid}`} className="text-primary hover:underline">
                                    {tutorial.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(tutorial.createdAt), "dd/MM/yyyy")}
                                </p>
                              </div>
                            </div>
                          ))}

                          {games.slice(0, 1).map((game) => (
                            <div key={game.id} className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Gamepad2 className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  Enviou um jogo:{" "}
                                  <Link href={`/games/${game.pid}`} className="text-primary hover:underline">
                                    {game.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(game.createdAt), "dd/MM/yyyy")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium">Sem atividades ainda</h3>
                          <p className="text-muted-foreground mt-1">
                            Comece a contribuir criando snippets, tutoriais ou jogos
                          </p>
                          <Button className="mt-4" asChild>
                            <Link href="/snippets/create">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Criar Snippet
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {snippets.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Snippets Recentes</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/snippets" className="gap-1">
                            Ver Todos
                          </Link>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {snippets.slice(0, 4).map((snippet) => (
                            <SnippetCard key={snippet.id} snippet={snippet} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sobre</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                          <p className="text-sm">{profile.bio || "Nenhuma Bio escrita ainda."}</p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Contatos & Links</h3>
                          <div className="space-y-2">
                            {profile && profile.github && (
                              <Link
                                href={`${profile.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <Github className="h-4 w-4 mr-2" />
                                GitHub
                              </Link>
                            )}
                            {profile && profile.linkedin && (
                              <Link
                                href={`${profile.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <Linkedin className="h-4 w-4 mr-2" />
                                LinkedIn
                              </Link>
                            )}
                            {profile && profile.website && (
                              <Link
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Website
                              </Link>
                            )}
                            {profile && profile.dailyDev && (
                              <Link
                                href={profile.dailyDev}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <CodeXml className="h-4 w-4 mr-2" />
                                Daily.dev
                              </Link>
                            )}
                            {profile && profile.twitter && (
                              <Link
                                href={profile.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <TwitterIcon className="h-4 w-4 mr-2" />
                                Twitter
                              </Link>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Membro Desde</h3>
                          <p className="text-sm flex items-center capitalize">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(profile.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Apoie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <Heart className="h-8 w-8 text-red-500 mx-auto" />
                        <p className="text-sm">
                          Se você gosta das contribuições de {profile.username}, considere apoiá-las.
                        </p>
                        <Button className="w-full" asChild>
                          <Link href="/donations">Apoie {profile.username}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="snippets">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Meus Snippets</h2>
                  <Button asChild>
                    <Link href="/snippets/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Snippet
                    </Link>
                  </Button>
                </div>

                {snippets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {snippets.map((snippet) => (
                      <SnippetCard key={snippet.id} snippet={snippet} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Code className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Você não criou nenhum snippet ainda</p>
                      <Button asChild>
                        <Link href="/snippets/create">Criar Snippets</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tutorials">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Tutoriais</h2>
                  <Button asChild>
                    <Link href="/tutorials/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Tutorial
                    </Link>
                  </Button>
                </div>

                {tutorials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutorials.map((tutorial, index) => (
                      <TutorialCard tutorial={tutorial} key={index} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Você não criou nenhum tutorial ainda</p>
                      <Button asChild>
                        <Link href="/tutorials/create">Criar Tutorial</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="games">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Jogos</h2>
                  <Button asChild>
                    <Link href="/games/submit">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Enviar Jogo
                    </Link>
                  </Button>
                </div>

                {games.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                      <Card key={game.id} className="overflow-hidden cursor-pointer transition-all hover:shadow-md">
                        <Link href={`/games/${game.pid}`} className="h-full flex flex-col">
                          <div className="relative h-40 w-full">
                            <Image
                              src={game.coverImage_url || "/placeholder.svg"}
                              alt={game.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                              {game.category.name}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
                            <div className="flex items-center justify-between mt-4 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Download className="mr-1 h-4 w-4" />
                                {game.downloads.toLocaleString()}
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Você não enviou nenhum jogo ainda</p>
                      <Button asChild>
                        <Link href="/games/submit">Enviar Jogo</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPage id={user.id} email={user.email} profile={{ github: user.github, linkedin: user.linkedin, website: user.website, bio: user.bio }} username={user.username} />
            </TabsContent>

            {hasModeratorRole &&
              <TabsContent value="admin-submissions">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciamento de Submissões</CardTitle>
                    <CardDescription>Revise e aprove submissões de usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SubmissionsManager />
                  </CardContent>
                </Card>
              </TabsContent>
            }

            {hasModeratorRole &&
              <TabsContent value="admin-categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciamento de categorias de conteúdo</CardTitle>
                    <CardDescription>Crie, Edite e Apague categorias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Criar Nova Categoria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmitCategory} className="space-y-4">
                            <div>
                              <Label htmlFor="role-name">Descrição *</Label>
                              <Input
                                id="category-name"
                                required
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Descreva a categoria"
                              />
                              {newCategoryError && <p className="text-sm text-destructive">{newCategoryError}</p>}
                            </div>
                            <Button type="submit" className="w-full">
                              Criar Categoria
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Categorias Existentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {categories && categories.length > 0 ? (
                            <div className="space-y-2">
                              {categories.map((category) => {
                                return category ? (
                                  <div
                                    key={category.id}
                                    className="flex items-center justify-between p-3 rounded-md"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <p className="capitalize">{category.name}</p>
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                    >
                                      Remover
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center mt-2">
                              Ainda não existe nenhuma categoria cadastrada
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            }

            {hasAdminRole &&
              <TabsContent value="admin-roles">
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciamento de Papéis</CardTitle>
                    <CardDescription>Crie e atribua papéis aos usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RolesManager />
                  </CardContent>
                </Card>
              </TabsContent>
            }
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}


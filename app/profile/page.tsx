"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Label } from "@/components/label"
import { Textarea } from "@/components/textarea"
import { Input } from "@/components/input"
import { Badge } from "@/components/badge"
import { Separator } from "@/components/separator"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/lib/use-user"
import { mockSnippets, mockProfiles, mockTutorials, mockGames } from "@/lib/mock-data"
import SnippetCard from "@/ui/components/snippetCard"
import {
  Save,
  User,
  Code,
  Settings,
  BookOpen,
  Gamepad2,
  Github,
  Twitter,
  Globe,
  Mail,
  Calendar,
  Edit,
  Loader2,
  PlusCircle,
  Activity,
  Heart,
  Clock,
  Download,
} from "lucide-react"
import { Snippet, UserProfile } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()

  const { toast } = useToast()
  const { user, loading } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [tutorials, setTutorials] = useState<typeof mockTutorials>([])
  const [games, setGames] = useState<typeof mockGames>([])
  const [bio, setBio] = useState<string>("")
  const [website, setWebsite] = useState<string>("")
  const [twitter, setTwitter] = useState<string>("")
  const [github, setGithub] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("overview")

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const userProfile = mockProfiles.find((p) => p.id === user.id) || {
        id: user.id,
        username: user.user_metadata?.user_name || "user",
        avatar_url: user.user_metadata?.avatar_url || "/placeholder.svg?height=100&width=100",
        bio: "PS2 homebrew developer and enthusiast",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        website: "https://example.com",
        twitter: "ps2dev",
        github: "ps2dev",
      }

      const userSnippets = mockSnippets.filter((s) => s.user_id === user.id)
      const userTutorials = mockTutorials.filter((t) => t.author.id === user.id)
      const userGames = mockGames.filter((g) => g.author.id === user.id)

      setProfile(userProfile)
      setBio(userProfile.bio || "")
      setWebsite(userProfile.website || "")
      setTwitter(userProfile.twitter || "")
      setGithub(userProfile.github || "")
      setSnippets(userSnippets)
      setTutorials(userTutorials)
      setGames(userGames)
      setLoadingProfile(false)

      return;
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user || !profile) return

    try {
      setIsSaving(true)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile({
        ...profile,
        bio: bio,
        website: website,
        twitter: twitter,
        github: github,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      setIsSaving(false)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  if (loading || loadingProfile) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-16rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <p className="text-muted-foreground">{profile.bio || "No bio provided yet."}</p>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href="/snippets/create">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Snippet
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Joined {format(new Date(profile.created_at), "MMMM yyyy")}
                </div>
                {profile.github && (
                  <Link
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1.5" />
                    {profile.github}
                  </Link>
                )}
                {profile.twitter && (
                  <Link
                    href={`https://twitter.com/${profile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-4 w-4 mr-1.5" />
                    {profile.twitter}
                  </Link>
                )}
                {profile.website && (
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
                    <div className="text-sm text-muted-foreground">Tutorials</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">{games.length}</div>
                    <div className="text-sm text-muted-foreground">Games</div>
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
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity</CardTitle>
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
                                  Created a new snippet:{" "}
                                  <Link href={`/snippets/${snippet.id}`} className="text-primary hover:underline">
                                    {snippet.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(snippet.created_at), "MMMM dd, yyyy")}
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
                                  Published a tutorial:{" "}
                                  <Link href={`/tutorials/${tutorial.slug}`} className="text-primary hover:underline">
                                    {tutorial.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(tutorial.created_at), "MMMM dd, yyyy")}
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
                                  Released a game:{" "}
                                  <Link href={`/games/${game.slug}`} className="text-primary hover:underline">
                                    {game.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(game.created_at), "MMMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium">No activity yet</h3>
                          <p className="text-muted-foreground mt-1">
                            Start contributing by creating snippets, tutorials, or games
                          </p>
                          <Button className="mt-4" asChild>
                            <Link href="/snippets/create">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Create Snippet
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {snippets.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Snippets</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/snippets" className="gap-1">
                            View All
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
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                          <p className="text-sm">{profile.bio || "No bio provided yet."}</p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact & Links</h3>
                          <div className="space-y-2">
                            {profile.github && (
                              <Link
                                href={`https://github.com/${profile.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <Github className="h-4 w-4 mr-2" />
                                GitHub
                              </Link>
                            )}
                            {profile.twitter && (
                              <Link
                                href={`https://twitter.com/${profile.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm hover:text-primary transition-colors"
                              >
                                <Twitter className="h-4 w-4 mr-2" />
                                Twitter
                              </Link>
                            )}
                            {profile.website && (
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
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Member Since</h3>
                          <p className="text-sm flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(profile.created_at), "MMMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <Heart className="h-8 w-8 text-red-500 mx-auto" />
                        <p className="text-sm">
                          If you enjoy {profile.username}'s contributions, consider supporting them.
                        </p>
                        <Button className="w-full" asChild>
                          <Link href="/donations">Support {profile.username}</Link>
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
                    {tutorials.map((tutorial) => (
                      <Card key={tutorial.id} className="overflow-hidden cursor-pointer transition-all hover:shadow-md">
                        <Link href={`/tutorials/${tutorial.slug}`} className="h-full flex flex-col">
                          <div className="relative h-40 w-full">
                            <Image
                              src={tutorial.coverImage || "/placeholder.svg"}
                              alt={tutorial.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                              {tutorial.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {tutorial.read_time} min read
                              </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{tutorial.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{tutorial.excerpt}</p>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't created any tutorials yet</p>
                      <Button asChild>
                        <Link href="/tutorials/create">Create Tutorial</Link>
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
                      Submit Game
                    </Link>
                  </Button>
                </div>

                {games.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                      <Card key={game.id} className="overflow-hidden cursor-pointer transition-all hover:shadow-md">
                        <Link href={`/games/${game.slug}`} className="h-full flex flex-col">
                          <div className="relative h-40 w-full">
                            <Image
                              src={game.coverImage || "/placeholder.svg"}
                              alt={game.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                              {game.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
                            <div className="flex items-center justify-between mt-4 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Download className="mr-1 h-4 w-4" />
                                {game.download_count.toLocaleString()}
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
                      <p className="text-muted-foreground mb-4">You haven't submitted any games yet</p>
                      <Button asChild>
                        <Link href="/games/submit">Submit Game</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Tell us about yourself and your PS2 homebrew projects"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-10"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="pl-10"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="pl-10"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBio(profile.bio || "")
                        setWebsite(profile.website || "")
                        setTwitter(profile.twitter || "")
                        setGithub(profile.github || "")
                      }}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value="user@example.com" disabled className="pl-10" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To change your email address, please contact support
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="username" value={profile.username} disabled className="pl-10" />
                    </div>
                    <p className="text-xs text-muted-foreground">Username cannot be changed after account creation</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      These actions are irreversible. Please proceed with caution.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}


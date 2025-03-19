"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Separator } from "@/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { useToast } from "@/hooks/use-toast"
import { Github, Mail, ArrowRight, Loader2 } from "lucide-react"
import { userService } from "@/data/services/users/users.service"
import Validator from "@/data/utils/validator.utils"

export default function LoginPage() {
  const router = useRouter()

  const { toast } = useToast()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isGithubLoggingIn, setIsGithubLoggingIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoggingIn(true)

      const token = await userService.login(email, password)

      if (Validator.required(token)) {

        toast({
          title: "Logado com sucesso!",
          description: "Bem-vindo de volta ao PS2 Homebrew Hub!",
        })
        router.push("/")
        return
      }

    } catch (error) {
      console.error("Error logging in:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setIsGithubLoggingIn(true)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "GitHub login successful",
        description: "Welcome back to PS2 Homebrew Hub!",
      })

      router.push("/profile")
    } catch (error) {
      console.error("Error logging in with GitHub:", error)
      toast({
        title: "GitHub login failed",
        description: "There was an issue connecting to GitHub. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGithubLoggingIn(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <div className="relative h-12 w-12">
                  <Image src="/placeholder.svg?height=48&width=48" alt="PS2 Homebrew Hub" fill className="rounded-lg" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
              <CardDescription>Entre em sua conta para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubLogin}
                disabled={isGithubLoggingIn || isLoggingIn}
              >
                {isGithubLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue com Github
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isLoggingIn}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Esqueceu sua senha ?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? "border-destructive" : ""}
                        disabled={isLoggingIn}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoggingIn || isGithubLoggingIn}>
                      {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Entre
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Não possui um conta ?{" "}
                <Link href="/register" className="text-primary hover:underline inline-flex items-center">
                  Crie uma aqui
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


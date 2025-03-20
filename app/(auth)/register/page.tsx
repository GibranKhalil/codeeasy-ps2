"use client"

import type React from "react"

import { useEffect, useReducer, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Separator } from "@/components/separator"
import { Checkbox } from "@/components/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Github, User, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react"
import { CreateUserDto } from "@/data/@types/models/users/dto/create-user.dto"
import { userService } from "@/data/services/users/users.service"
import { User as UserType } from "@/data/@types/models/users/entities/user.entity"
import Validator from "@/data/utils/validator.utils"
import { useAuth } from "@/hooks/use-auth"

type ExtendedUserDto = CreateUserDto & { confirm?: string }

const newUserInitialData: ExtendedUserDto = {
  email: '',
  username: '',
  password: '',
  confirm: ''
}

type UserAction =
  | { type: "SET_FIELD"; field: keyof ExtendedUserDto; value: string }
  | { type: "RESET" };

const userReducer = (state: ExtendedUserDto, action: UserAction): ExtendedUserDto => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return newUserInitialData;
    default:
      return state;
  }
};

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGithubRegistering, setIsGithubRegistering] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [newUser, setUser] = useReducer(userReducer, newUserInitialData);

  const { user } = useAuth()

  useEffect(() => {
    if (Validator.required(user)) {
      router.push('/snippets')
      return
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newUser.username.trim()) {
      newErrors.username = "Usuário é um campo obrigatório"
    } else if (newUser.username.length < 3) {
      newErrors.username = "Seu nome de usuário deve ter no mínimo 3 caracteres"
    }

    if (!newUser.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!newUser.password) {
      newErrors.password = "Senha obrigatório"
    } else if (newUser.password.length < 6) {
      newErrors.password = "Sua senha deve ter no mínimo 6 caracteres"
    }

    if (newUser.password !== newUser.confirm) {
      newErrors.confirmPassword = "Senhas não conferem"
    }

    // if (!acceptTerms) {
    //   newErrors.acceptTerms = "You must accept the terms and conditions"
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsRegistering(true)

      const newUserData = newUser;
      delete newUserData.confirm;

      const response = await userService.registerUser(newUserData)

      if (Validator.required((response.data as UserType).id)) {
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao PS2 Homebrew Hub!",
        })

        router.push("/login")
        return
      }

      toast({
        title: "Não foi possível criar sua conta",
        description: "Tivemos um problema com sua solicitação. Por favor, tente novamente!",
        variant: "destructive",
      })
      return

    } catch (error) {
      console.error("Error registering:", error)
      toast({
        title: "Não foi possível criar sua conta",
        description: "Tivemos um problema com sua solicitação. Por favor, tente novamente!",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleGithubRegister = async () => {
    try {
      setIsGithubRegistering(true)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "GitHub registration successful",
        description: "Welcome to PS2 Homebrew Hub!",
      })

      router.push("/profile")
    } catch (error) {
      console.error("Error registering with GitHub:", error)
      toast({
        title: "GitHub registration failed",
        description: "There was an issue connecting to GitHub. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGithubRegistering(false)
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
              <CardTitle className="text-2xl font-bold">Crie uma Conta</CardTitle>
              <CardDescription>Entre na comunidade PS2 homebrew</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubRegister}
                disabled={isGithubRegistering || isRegistering}
              >
                {isGithubRegistering ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Entre com GitHub
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or with email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="username"
                      value={newUser.username}
                      onChange={(e) => setUser({ field: 'username', type: 'SET_FIELD', value: e.target.value })}
                      className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                      disabled={isRegistering}
                    />
                  </div>
                  {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={newUser.email}
                      onChange={(e) => setUser({ field: 'email', type: 'SET_FIELD', value: e.target.value })}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      disabled={isRegistering}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setUser({ field: 'password', type: 'SET_FIELD', value: e.target.value })}
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                      disabled={isRegistering}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme sua Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={newUser.confirm}
                      onChange={(e) => setUser({ field: 'confirm', type: 'SET_FIELD', value: e.target.value })}
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      disabled={isRegistering}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={isRegistering}
                  />
                  <label
                    htmlFor="terms"
                    className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.acceptTerms ? "text-destructive" : ""
                      }`}
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>} */}

                <Button type="submit" className="w-full" disabled={isRegistering || isGithubRegistering}>
                  {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Cria Conta
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Entre aqui
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


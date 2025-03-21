"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Github, LogOut, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/sheet"
import { Button } from "@/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    router.push("/register")
    logout()
  }

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/games", label: "Jogos" },
    { href: "/tutorials", label: "Tutoriais" },
    { href: "/snippets", label: "Snippets" },
    { href: "/ranking", label: "Ranking" },
    { href: "/donations", label: "Doações" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg ${pathname === item.href ? "font-medium text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">PS2 Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button> */}

          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || ""} />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.pid}`}>
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">
                      Entrar
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href="/register">
                      Crie uma conta
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}


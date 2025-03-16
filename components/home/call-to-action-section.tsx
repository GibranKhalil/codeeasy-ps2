"use client"

import Link from "next/link"
import { Heart, Github } from "lucide-react"
import { Badge } from "../badge"
import { Button } from "../button"

export default function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-primary/5 border-y">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4" variant="outline">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              Ajude a Comunidade
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ajude a Aprimorar a Comunidade PS2 Homebrew</h2>
            <p className="text-muted-foreground mb-6">
              Suas contribuições nos ajudam a manter o PS2 Homebrew Hub, armazenar arquivos, desenvolver novas features e ajudar
              desenvolvedores talentosos a criar ferramentas e jogos incríveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/donations">
                  <Heart className="mr-2 h-4 w-4 text-red-200" />
                  Apoie o Projeto
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Contribua no GitHub
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-1">Custos do Servidor</h3>
                  <p className="text-sm text-muted-foreground">Mantendo nossa plataforma online e rápida</p>
                </div>
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-1">Documentação</h3>
                  <p className="text-sm text-muted-foreground">Criando guias e referências</p>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-1">Desenvolvedores</h3>
                  <p className="text-sm text-muted-foreground">Ajudando desenvolvedores a criar projetos fantásticos</p>
                </div>
                <div className="bg-background rounded-lg p-4 shadow-sm border">
                  <h3 className="font-medium mb-1">Eventos da Comunidade</h3>
                  <p className="text-sm text-muted-foreground">Organizando hackathons e competições</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-[250px] w-[250px] rounded-full bg-primary/20 blur-[100px]" />
          </div>
        </div>
      </div>
    </section>
  )
}


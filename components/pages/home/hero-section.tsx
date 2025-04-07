"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, Joystick } from "lucide-react"
import { Badge } from "../../badge"
import { Button } from "../../button"
import PS2Logo3DModel from "../ps2Logo3DModel"

export default function HeroSection() {

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background/80 z-0">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={heroVariants}>
            <motion.div variants={itemVariants} className="space-y-2">
              <Badge className="mb-4 text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Desenvolvimento de PS2 Orientado pela Comunidade
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Desenvolva Jogos <span className="text-primary">PS2 Homebrew</span> Incríveis
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                Junte-se à comunidade de desenvolvedores do PlayStation 2. Compartilhe trechos de código, colabore em projetos e aprenda como criar jogos para PS2.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-6">
                <Link href="/games">
                  <Joystick className="mr-2 h-5 w-5" />
                  Ver Jogos
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-6">
                <Link href="/tutorials">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explorar Tutoriais
                </Link>
              </Button>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative lg:ml-auto"
          >
            <div className="flex-shrink-0 w-fit">
              <PS2Logo3DModel />
            </div>

            <div className="absolute -bottom-6 -right-6 -z-10 h-[250px] w-[250px] rounded-full bg-primary/30 blur-[100px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}


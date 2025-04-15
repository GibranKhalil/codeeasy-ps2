import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import App from "./app"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PS2 Homebrew Hub",
  description: "Uma comunidade para desenvolvedores de jogos homebrew para PS2",
  creator: "Gibran Khalil",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <App children={children} />
      </body>
    </html>

  )
}

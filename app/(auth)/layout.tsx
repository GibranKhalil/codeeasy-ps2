import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import '../globals.css'
import { AuthProvider } from "@/shared/authContext"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "PS2 Homebrew Hub",
    description: "Uma comunidade para desenvolvedores de jogos homebrew para PS2",
    creator: "Gibran Khalil",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-background`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                    <AuthProvider>
                        {children}
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
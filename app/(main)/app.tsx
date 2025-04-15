'use client'

import Footer from "@/components/footer"
import Navbar from "@/components/navBar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "@/shared/authContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function App({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <AuthProvider>
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
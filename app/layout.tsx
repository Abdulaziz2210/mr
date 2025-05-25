import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '../styles/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dream Zone CD Mock IELTS Test",
  description: "Dream Zone CD Mock IELTS Test",
  icons: {
    icon: "/dreamzone.png",
    apple: "/dreamzone.png",
  },
  generator: "TopSpeed",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

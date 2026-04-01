import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RoleProvider } from "@/providers/role-provider"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export const metadata: Metadata = {
  title: "Studio OS",
  description: "All-in-one studio management platform",
  icons: {
    icon: [
      { url: `${base}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${base}/favicon-16.png`, sizes: "16x16", type: "image/png" },
    ],
    apple: `${base}/apple-touch-icon.png`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RoleProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-right" />
        </RoleProvider>
      </body>
    </html>
  )
}

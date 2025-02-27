import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { FoodInventoryProvider } from "@/context/FoodInventoryContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FoodBuddy - Smart Kitchen Companion",
  description: "Track groceries, prevent food wastage, and discover recipes with a simple camera scan.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FoodInventoryProvider>
          {children}
        </FoodInventoryProvider>
      </body>
    </html>
  )
}


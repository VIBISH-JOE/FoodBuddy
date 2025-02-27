"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ChefHat, Bell, BarChart, Mic, Users, Heart, ShoppingBag, ScanLine } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useContext, useState } from "react"
import { FoodInventoryContext } from "@/context/FoodInventoryContext"

type NutrientInfo = {
  current: number
  recommended: number
  unit: string
}

const calculateNutrients = (inventory: any[]): Record<string, NutrientInfo> => {
  return {
    protein: {
      current: 45,
      recommended: 56,
      unit: 'g'
    },
    iron: {
      current: 6,
      recommended: 8,
      unit: 'mg'
    },
    vitaminC: {
      current: 65,
      recommended: 90,
      unit: 'mg'
    }
  }
}

const getRecommendedFoods = (nutrients: Record<string, NutrientInfo>) => {
  const recommendations = []
  
  if (nutrients.protein.current < nutrients.protein.recommended) {
    recommendations.push({ food: "Greek Yogurt", benefit: "Protein source" })
  }
  if (nutrients.iron.current < nutrients.iron.recommended) {
    recommendations.push({ food: "Spinach", benefit: "Rich in Iron" })
  }
  if (nutrients.vitaminC.current < nutrients.vitaminC.recommended) {
    recommendations.push({ food: "Oranges", benefit: "Vitamin C boost" })
  }
  
  return recommendations
}

export default function Home() {
  const { inventory, getNutrientTotals } = useContext(FoodInventoryContext)
  const nutrients = getNutrientTotals()
  const recommendations = getRecommendedFoods(nutrients)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary dark:text-primary-light">FoodBuddy</span>
          </div>
          <nav className={`md:flex gap-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-300">
              Dashboard
            </Link>
            <Link href="/inventory" className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-300">
              Inventory
            </Link>
            <Link href="/recipes" className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-300">
              Recipes
            </Link>
            <Link href="/stats" className="text-sm font-medium hover:underline underline-offset-4 dark:text-gray-300">
              Stats
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 dark:text-gray-300"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-gray-100">
                    Smart Kitchen Companion
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Track groceries, prevent food wastage, and discover recipes with a simple camera scan.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/scan">
                    <Button className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Scan Groceries
                    </Button>
                  </Link>
                  <Link href="/inventory">
                    <Button variant="outline" className="w-full">
                      View Inventory
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid gap-4 w-full max-w-sm">
                  <Card className="w-full">
                    <CardContent className="p-6">
                      <div className="space-y-2 text-center">
                        <h2 className="text-xl font-bold dark:text-gray-100">Expiring Soon</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">You have 3 items expiring in the next 48 hours</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                              <span className="text-red-600 dark:text-red-300 text-xs font-medium">1d</span>
                            </div>
                            <div>
                              <div className="font-medium dark:text-gray-100">Milk</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">1 carton</div>
                            </div>
                          </div>
                          <Badge variant="destructive">Today</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                              <span className="text-orange-600 dark:text-orange-300 text-xs font-medium">2d</span>
                            </div>
                            <div>
                              <div className="font-medium dark:text-gray-100">Spinach</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">1 bunch</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-100 dark:bg-orange-900 dark:border-orange-700">
                            Tomorrow
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                              <span className="text-orange-600 dark:text-orange-300 text-xs font-medium">2d</span>
                            </div>
                            <div>
                              <div className="font-medium dark:text-gray-100">Chicken Breast</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">500g</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-100 dark:bg-orange-900 dark:border-orange-700">
                            Tomorrow
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href="/recipes">
                          <Button variant="outline" className="w-full">
                            <ChefHat className="mr-2 h-4 w-4" />
                            Get Recipe Ideas
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="text-xl dark:text-gray-100">Nutrition Overview</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Based on your current inventory</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(nutrients).map(([nutrient, info]) => (
                        <div key={nutrient} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize dark:text-gray-100">{nutrient}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {info.current}{info.unit} / {info.recommended}{info.unit} daily
                            </span>
                          </div>
                          <Progress 
                            value={(info.current / info.recommended) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 dark:text-gray-100">Recommended Foods</h4>
                        <div className="space-y-2">
                          {recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge variant="secondary">{rec.food}</Badge>
                              <span className="text-gray-500 dark:text-gray-400">{rec.benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-gray-100">Key Features</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your kitchen efficiently
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <Camera className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Camera Scan</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Automatically detect groceries and set expiry dates with a simple scan
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <Bell className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Expiry Notifications</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Get daily reminders about food items that are about to expire
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <ChefHat className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Recipe Suggestions</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Get personalized recipe ideas based on your expiring ingredients
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <BarChart className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Food Waste Tracker</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Monitor how much food you've saved from going to waste
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <Mic className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Voice-Based Entry</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Add items to your inventory using simple voice commands
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <Users className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Family Sharing</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Share your grocery list with family members for better coordination
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <Heart className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Donation Reminder</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Get suggestions for donating excess food to nearby organizations
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <ShoppingBag className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">Shopping List</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Automatically add expired or finished items to your shopping list
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <ScanLine className="h-6 w-6 text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-lg font-bold dark:text-gray-100">AR Pantry Scanner</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  Visualize what's inside your fridge without opening it
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
          <div className="text-xs text-gray-500 dark:text-gray-400">© 2025 FoodBuddy. All rights reserved.</div>
          <nav className="flex gap-4 text-xs">
            <Link href="#" className="text-gray-500 hover:underline underline-offset-4 dark:text-gray-400">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:underline underline-offset-4 dark:text-gray-400">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}


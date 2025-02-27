"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, ChefHat, Heart, Share2, Bookmark, Filter, Utensils } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RecipesPage() {
  const [filterType, setFilterType] = useState("all")

  const recipes = [
    {
      id: 1,
      title: "Spinach & Chicken Stir Fry",
      time: "25 mins",
      difficulty: "Easy",
      ingredients: ["Chicken Breast", "Spinach", "Rice"],
      image: "/placeholder.svg?height=200&width=400",
      type: "high-protein",
    },
    {
      id: 2,
      title: "Creamy Spinach Pasta",
      time: "20 mins",
      difficulty: "Easy",
      ingredients: ["Pasta", "Spinach", "Milk"],
      image: "/placeholder.svg?height=200&width=400",
      type: "vegetarian",
    },
    {
      id: 3,
      title: "Apple Yogurt Parfait",
      time: "10 mins",
      difficulty: "Easy",
      ingredients: ["Yogurt", "Apples"],
      image: "/placeholder.svg?height=200&width=400",
      type: "low-carb",
    },
    {
      id: 4,
      title: "Tomato & Cheese Sandwich",
      time: "5 mins",
      difficulty: "Easy",
      ingredients: ["Bread", "Cheese", "Tomatoes"],
      image: "/placeholder.svg?height=200&width=400",
      type: "vegetarian",
    },
  ]

  const filteredRecipes = filterType === "all" ? recipes : recipes.filter((recipe) => recipe.type === filterType)

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recipe Suggestions</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                  <DropdownMenuRadioItem value="all">All Recipes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="high-protein">High Protein</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="low-carb">Low Carb</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="vegetarian">Vegetarian</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-500">Based on your expiring ingredients: Spinach, Milk, Chicken Breast</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="suggested" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggested">Suggested</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="suggested" className="mt-4 space-y-4">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{recipe.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ChefHat className="h-4 w-4 mr-1" />
                        {recipe.difficulty}
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {recipe.type}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium">Uses expiring ingredients:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recipe.ingredients.map((ingredient, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <Utensils className="h-4 w-4 mr-2" />
                      View Recipe
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="saved" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bookmark className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="font-medium text-gray-500">No saved recipes yet</h3>
                <p className="text-sm text-gray-400 mt-1">Bookmark recipes to save them for later</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="font-medium text-gray-500">No recipe history</h3>
                <p className="text-sm text-gray-400 mt-1">Recipes you've viewed will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


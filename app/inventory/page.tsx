"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, Trash2, ChevronDown, ChevronUp, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InventoryPage() {
  const [sortBy, setSortBy] = useState("expiry")
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpand = (category: string) => {
    if (expanded.includes(category)) {
      setExpanded(expanded.filter((c) => c !== category))
    } else {
      setExpanded([...expanded, category])
    }
  }

  const foodItems = [
    {
      category: "Dairy",
      items: [
        { name: "Milk", quantity: "1 carton", expiry: "1 day", status: "critical" },
        { name: "Yogurt", quantity: "500g", expiry: "5 days", status: "good" },
        { name: "Cheese", quantity: "200g", expiry: "10 days", status: "good" },
      ],
    },
    {
      category: "Produce",
      items: [
        { name: "Spinach", quantity: "1 bunch", expiry: "2 days", status: "warning" },
        { name: "Apples", quantity: "5", expiry: "7 days", status: "good" },
        { name: "Tomatoes", quantity: "4", expiry: "4 days", status: "good" },
      ],
    },
    {
      category: "Meat",
      items: [
        { name: "Chicken Breast", quantity: "500g", expiry: "2 days", status: "warning" },
        { name: "Ground Beef", quantity: "300g", expiry: "3 days", status: "warning" },
      ],
    },
    {
      category: "Pantry",
      items: [
        { name: "Pasta", quantity: "500g", expiry: "180 days", status: "good" },
        { name: "Rice", quantity: "2kg", expiry: "300 days", status: "good" },
        { name: "Canned Beans", quantity: "3 cans", expiry: "365 days", status: "good" },
        { name: "Bread", quantity: "1 loaf", expiry: "5 days", status: "good" },
      ],
    },
  ]

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
            <CardTitle className="text-xl">Food Inventory</CardTitle>
            <Link href="/scan">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Items
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search items..." className="pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="expiry">Sort by Expiry Date</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">Sort by Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="category">Sort by Category</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
              <TabsTrigger value="good">Good</TabsTrigger>
              <TabsTrigger value="category">Category</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {foodItems.flatMap((category) =>
                category.items.map((item, index) => (
                  <div
                    key={`${category.category}-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-sm text-gray-500">{category.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          item.status === "critical"
                            ? "destructive"
                            : item.status === "warning"
                              ? "outline"
                              : "secondary"
                        }
                        className={item.status === "warning" ? "text-orange-500 border-orange-200 bg-orange-100" : ""}
                      >
                        {item.expiry}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                )),
              )}
            </TabsContent>
            <TabsContent value="expiring" className="mt-4 space-y-4">
              {foodItems.flatMap((category) =>
                category.items
                  .filter((item) => item.status === "critical" || item.status === "warning")
                  .map((item, index) => (
                    <div
                      key={`${category.category}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">{item.quantity}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-sm text-gray-500">{category.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={item.status === "critical" ? "destructive" : "outline"}
                          className={item.status === "warning" ? "text-orange-500 border-orange-200 bg-orange-100" : ""}
                        >
                          {item.expiry}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  )),
              )}
            </TabsContent>
            <TabsContent value="good" className="mt-4 space-y-4">
              {foodItems.flatMap((category) =>
                category.items
                  .filter((item) => item.status === "good")
                  .map((item, index) => (
                    <div
                      key={`${category.category}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">{item.quantity}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-sm text-gray-500">{category.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.expiry}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  )),
              )}
            </TabsContent>
            <TabsContent value="category" className="mt-4 space-y-4">
              {foodItems.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(category.category)}
                  >
                    <p className="font-medium">{category.category}</p>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {expanded.includes(category.category) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {expanded.includes(category.category) && (
                    <div className="divide-y">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                item.status === "critical"
                                  ? "destructive"
                                  : item.status === "warning"
                                    ? "outline"
                                    : "secondary"
                              }
                              className={
                                item.status === "warning" ? "text-orange-500 border-orange-200 bg-orange-100" : ""
                              }
                            >
                              {item.expiry}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


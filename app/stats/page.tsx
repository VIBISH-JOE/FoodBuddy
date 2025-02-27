"use client"

import { useContext } from "react"
import { FoodInventoryContext } from "@/context/FoodInventoryContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Stats() {
  const { getNutrientTotals, inventory } = useContext(FoodInventoryContext)
  const nutrients = getNutrientTotals()

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(nutrients).map(([nutrient, info]) => (
              <div key={nutrient} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium capitalize">{nutrient}</h3>
                    <p className="text-sm text-gray-500">
                      {info.current}{info.unit} of {info.recommended}{info.unit} recommended daily
                    </p>
                  </div>
                  <Badge variant={info.current >= info.recommended ? "default" : "secondary"}>
                    {Math.round((info.current / info.recommended) * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={(info.current / info.recommended) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {inventory.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.servingSize}g serving{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
z
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(nutrients).map(([nutrient, info]) => {
                if (info.current < info.recommended * 0.7) {
                  return (
                    <div key={nutrient} className="flex items-start gap-4">
                      <Badge variant="secondary" className="mt-0.5">Low</Badge>
                      <div>
                        <h4 className="font-medium capitalize">{nutrient}</h4>
                        <p className="text-sm text-gray-500">
                          Consider adding more {nutrient}-rich foods to your inventory.
                          You're currently at {Math.round((info.current / info.recommended) * 100)}% of your daily recommended intake.
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

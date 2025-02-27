"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { FoodItem } from '../api/foods/route'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function StatsPage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/foods');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const calculateNutritionalTotals = () => {
    return inventory.reduce((acc, item) => ({
      calories: acc.calories + (item.nutritionalValues.calories * item.quantity),
      protein: acc.protein + (item.nutritionalValues.protein * item.quantity),
      carbs: acc.carbs + (item.nutritionalValues.carbs * item.quantity),
      fats: acc.fats + (item.nutritionalValues.fats * item.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const getCategoryDistribution = () => {
    const distribution = inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getExpiryDistribution = () => {
    const now = new Date();
    const distribution = inventory.reduce((acc, item) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntilExpiry <= 0) acc['Expired'] = (acc['Expired'] || 0) + 1;
      else if (daysUntilExpiry <= 3) acc['Within 3 days'] = (acc['Within 3 days'] || 0) + 1;
      else if (daysUntilExpiry <= 7) acc['Within week'] = (acc['Within week'] || 0) + 1;
      else if (daysUntilExpiry <= 30) acc['Within month'] = (acc['Within month'] || 0) + 1;
      else acc['Later'] = (acc['Later'] || 0) + 1;
      
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value
    }));
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const nutritionalTotals = calculateNutritionalTotals();
  const categoryData = getCategoryDistribution();
  const expiryData = getExpiryDistribution();

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
        {/* Nutritional Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={600} height={300} data={[
              { name: 'Calories (kcal)', value: nutritionalTotals.calories },
              { name: 'Protein (g)', value: nutritionalTotals.protein },
              { name: 'Carbs (g)', value: nutritionalTotals.carbs },
              { name: 'Fats (g)', value: nutritionalTotals.fats },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={300} height={300}>
                <Pie
                  data={categoryData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          {/* Expiry Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Expiry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart width={300} height={300}>
                <Pie
                  data={expiryData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expiryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

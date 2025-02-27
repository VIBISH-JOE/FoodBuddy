"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

type NutritionInfo = {
  protein: number;
  iron: number;
  vitaminC: number;
  calories: number;
  // Add more nutrients as needed
};

type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  expiryDate: Date;
  servingSize: number; // in grams
  nutrition: NutritionInfo; // per 100g
};

type NutrientTotals = {
  protein: { current: number; recommended: number; unit: string };
  iron: { current: number; recommended: number; unit: string };
  vitaminC: { current: number; recommended: number; unit: string };
  calories: { current: number; recommended: number; unit: string };
};

type FoodInventoryContextType = {
  inventory: FoodItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: FoodItem) => void;
  getNutrientTotals: () => NutrientTotals;
};

// Recommended Daily Values (example values)
const RECOMMENDED_DAILY = {
  protein: 56, // grams
  iron: 8, // mg
  vitaminC: 90, // mg
  calories: 2000, // kcal
};

// Nutritional database (example values per 100g)
const NUTRITION_DATABASE: Record<string, NutritionInfo> = {
  "Chicken Breast": {
    protein: 31,
    iron: 1,
    vitaminC: 0,
    calories: 165,
  },
  "Spinach": {
    protein: 2.9,
    iron: 2.7,
    vitaminC: 28.1,
    calories: 23,
  },
  "Milk": {
    protein: 3.4,
    iron: 0.1,
    vitaminC: 0,
    calories: 42,
  },
  // Add more foods as needed
};

export const FoodInventoryContext = createContext<FoodInventoryContextType>({
  inventory: [],
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  getNutrientTotals: () => ({
    protein: { current: 0, recommended: 0, unit: 'g' },
    iron: { current: 0, recommended: 0, unit: 'mg' },
    vitaminC: { current: 0, recommended: 0, unit: 'mg' },
    calories: { current: 0, recommended: 0, unit: 'kcal' },
  }),
});

export function FoodInventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  
  const addItem = (item: FoodItem) => {
    setInventory(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setInventory(prev => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updatedItem: FoodItem) => {
    setInventory(prev =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
  };

  const getNutrientTotals = (): NutrientTotals => {
    const totals = inventory.reduce((acc, item) => {
      const nutrition = NUTRITION_DATABASE[item.name];
      if (!nutrition) return acc;

      // Calculate nutrients based on serving size and quantity
      const multiplier = (item.servingSize * item.quantity) / 100; // Convert to 100g basis
      return {
        protein: acc.protein + (nutrition.protein * multiplier),
        iron: acc.iron + (nutrition.iron * multiplier),
        vitaminC: acc.vitaminC + (nutrition.vitaminC * multiplier),
        calories: acc.calories + (nutrition.calories * multiplier),
      };
    }, {
      protein: 0,
      iron: 0,
      vitaminC: 0,
      calories: 0,
    });

    return {
      protein: { current: Math.round(totals.protein), recommended: RECOMMENDED_DAILY.protein, unit: 'g' },
      iron: { current: Math.round(totals.iron * 10) / 10, recommended: RECOMMENDED_DAILY.iron, unit: 'mg' },
      vitaminC: { current: Math.round(totals.vitaminC), recommended: RECOMMENDED_DAILY.vitaminC, unit: 'mg' },
      calories: { current: Math.round(totals.calories), recommended: RECOMMENDED_DAILY.calories, unit: 'kcal' },
    };
  };

  // Initialize with example data
  useEffect(() => {
    const initialInventory: FoodItem[] = [
      {
        id: "1",
        name: "Milk",
        quantity: 1,
        servingSize: 250, // 250g (about 1 cup)
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        nutrition: NUTRITION_DATABASE["Milk"],
      },
      {
        id: "2",
        name: "Spinach",
        quantity: 1,
        servingSize: 100, // 100g
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        nutrition: NUTRITION_DATABASE["Spinach"],
      },
      {
        id: "3",
        name: "Chicken Breast",
        quantity: 2,
        servingSize: 150, // 150g per serving
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        nutrition: NUTRITION_DATABASE["Chicken Breast"],
      },
    ];
    setInventory(initialInventory);
  }, []);

  return (
    <FoodInventoryContext.Provider
      value={{
        inventory,
        addItem,
        removeItem,
        updateItem,
        getNutrientTotals,
      }}
    >
      {children}
    </FoodInventoryContext.Provider>
  );
}

export function useFoodInventory() {
  const context = useContext(FoodInventoryContext);
  if (!context) {
    throw new Error("useFoodInventory must be used within FoodInventoryProvider");
  }
  return context;
}

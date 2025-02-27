import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface FoodItem {
  _id?: string;
  name: string;
  category: string;
  expiryDate: string;
  dateAdded: string;
  quantity: number;
  servingSize: number;
  nutritionalValues: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    vitamins: string[];
  };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("food_expiry_tracker");
    const inventory = await db.collection("foods").find({}).toArray();
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("food_expiry_tracker");
    const data = await request.json();
    
    const foodItem: FoodItem = {
      name: data.name,
      category: data.category,
      expiryDate: data.expiryDate,
      dateAdded: new Date().toISOString(),
      quantity: data.quantity || 1,
      servingSize: data.servingSize || 100,
      nutritionalValues: {
        calories: Number(data.nutritionalValues?.calories) || 0,
        protein: Number(data.nutritionalValues?.protein) || 0,
        carbs: Number(data.nutritionalValues?.carbs) || 0,
        fats: Number(data.nutritionalValues?.fats) || 0,
        vitamins: Array.isArray(data.nutritionalValues?.vitamins) ? data.nutritionalValues.vitamins : []
      }
    };
    
    const result = await db.collection("foods").insertOne(foodItem);
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      item: { ...foodItem, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add food item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("food_expiry_tracker");
    const { id } = await request.json();
    
    await db.collection("foods").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete food item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("food_expiry_tracker");
    const { id, ...data } = await request.json();
    
    const result = await db.collection("foods").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update food item' }, { status: 500 });
  }
}
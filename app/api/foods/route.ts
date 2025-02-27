import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("food_expiry_tracker");
  const inventory = await db.collection("foods").find({}).toArray();
  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db("food_expiry_tracker");
  const data = await request.json();
  
  const result = await db.collection("foods").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId });
}

export async function DELETE(request: Request) {
  const client = await clientPromise;
  const db = client.db("food_expiry_tracker");
  const { id } = await request.json();
  
  await db.collection("foods").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const client = await clientPromise;
  const db = client.db("food_expiry_tracker");
  const { id, ...data } = await request.json();
  
  await db.collection("foods").updateOne({ _id: new ObjectId(id) }, { $set: data });
  return NextResponse.json({ success: true });
}
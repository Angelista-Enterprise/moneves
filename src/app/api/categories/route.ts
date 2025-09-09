import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getTransactionCategories,
  createTransactionCategory,
} from "@/services/categories";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await getTransactionCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[API] Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, icon, color, bgColor } = body;

    if (!id || !name || !icon || !color || !bgColor) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const category = await createTransactionCategory({
      id,
      name,
      icon,
      color,
      bgColor,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

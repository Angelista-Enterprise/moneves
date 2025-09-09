import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactionCategorizations, budgetCategories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bunqTransactionId, categoryId, accountMappingId } = body;

    if (!bunqTransactionId) {
      return NextResponse.json(
        { error: "Bunq transaction ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to user
    if (categoryId) {
      const category = await db
        .select()
        .from(budgetCategories)
        .where(
          and(
            eq(budgetCategories.id, categoryId),
            eq(budgetCategories.userId, session.user.id)
          )
        )
        .limit(1);

      if (category.length === 0) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    // Check if categorization already exists
    const existingCategorization = await db
      .select()
      .from(transactionCategorizations)
      .where(
        and(
          eq(transactionCategorizations.bunqTransactionId, bunqTransactionId),
          eq(transactionCategorizations.userId, session.user.id)
        )
      )
      .limit(1);

    let result;
    if (existingCategorization.length > 0) {
      // Update existing categorization
      result = await db
        .update(transactionCategorizations)
        .set({
          categoryId: categoryId || null,
          accountMappingId: accountMappingId || null,
          isConfirmed: true,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(transactionCategorizations.bunqTransactionId, bunqTransactionId),
            eq(transactionCategorizations.userId, session.user.id)
          )
        )
        .returning();
    } else {
      // Create new categorization
      result = await db
        .insert(transactionCategorizations)
        .values({
          userId: session.user.id,
          bunqTransactionId,
          categoryId: categoryId || null,
          accountMappingId: accountMappingId || null,
          isConfirmed: true,
        })
        .returning();
    }

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return NextResponse.json(
      { error: "Failed to categorize transaction" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bunqTransactionId = searchParams.get("bunqTransactionId");

    if (!bunqTransactionId) {
      return NextResponse.json(
        { error: "Bunq transaction ID is required" },
        { status: 400 }
      );
    }

    const categorization = await db
      .select()
      .from(transactionCategorizations)
      .where(
        and(
          eq(transactionCategorizations.bunqTransactionId, bunqTransactionId),
          eq(transactionCategorizations.userId, session.user.id)
        )
      )
      .limit(1);

    return NextResponse.json(categorization[0] || null);
  } catch (error) {
    console.error("Error fetching transaction categorization:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction categorization" },
      { status: 500 }
    );
  }
}

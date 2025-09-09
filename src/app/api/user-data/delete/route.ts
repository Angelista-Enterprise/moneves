import { NextRequest, NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, deleteAccount = false } = body;

    // Verify the user is deleting their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (deleteAccount) {
      // Delete user account - cascade delete will handle all related data
      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      if (deletedUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log(
        `[API] Deleted user account ${userId} and all associated data (cascade delete)`
      );

      // Sign out the user after successful account deletion
      try {
        await signOut({ redirect: false });
        console.log(`[API] Signed out user ${userId} after account deletion`);
      } catch (signOutError) {
        console.error(`[API] Error signing out user ${userId}:`, signOutError);
        // Don't fail the deletion if sign out fails, but log the error
      }

      return NextResponse.json({
        success: true,
        message:
          "User account and all data deleted via cascade delete. User has been signed out.",
        signedOut: true,
      });
    } else {
      // For partial deletion, we would use the individual bulk delete endpoints
      // This endpoint is primarily for full account deletion
      return NextResponse.json(
        {
          success: false,
          error:
            "Use individual bulk delete endpoints for partial data deletion",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[API] Error deleting user data:", error);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }
}

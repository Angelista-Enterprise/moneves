import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Use the seed account as the leading demo account
    const demo = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, "test@moneves.com"),
    });
    if (!demo) return NextResponse.json({ exists: false });
    return NextResponse.json({
      exists: true,
      email: demo.email,
      password: "testpassword123",
    });
  } catch {
    return NextResponse.json({ exists: false });
  }
}

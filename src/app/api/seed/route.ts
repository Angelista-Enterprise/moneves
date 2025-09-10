import { NextResponse } from "next/server";
import { seedDatabase } from "../../../../scripts/seed-database";

export async function POST() {
  try {
    // Call the seed function directly instead of shell command
    await seedDatabase();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Seed API] Error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

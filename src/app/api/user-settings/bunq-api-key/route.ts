import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBunqApiKey, updateBunqApiKey } from "@/lib/api/user-settings";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await getBunqApiKey(session.user.id);
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("[API] Error fetching Bunq API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const success = await updateBunqApiKey(session.user.id, apiKey);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update API key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error updating Bunq API key:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

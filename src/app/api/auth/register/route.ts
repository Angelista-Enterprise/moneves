import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import { selectOneEncrypted, insertEncrypted } from "@/lib/db/encrypted-db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await selectOneEncrypted(
      users,
      "users",
      eq(users.email, email)
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await insertEncrypted(users, "users", {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      image: null,
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Auth] Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

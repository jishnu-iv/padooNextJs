import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { generateToken } from "../../../lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email && !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    } else if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    } else if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // ✅ Generate JWT
    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    // ✅ Remove password
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: safeUser,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

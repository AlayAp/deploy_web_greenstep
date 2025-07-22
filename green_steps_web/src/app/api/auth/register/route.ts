import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/lib/userModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const user = await User.create({ email, password: hashed, name });
  return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
} 
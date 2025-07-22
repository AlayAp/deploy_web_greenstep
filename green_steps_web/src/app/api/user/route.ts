import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/lib/userModel";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({
    email: user.email,
    name: user.name,
    notifications: user.notifications,
    ecoInterests: user.ecoInterests,
    createdAt: user.createdAt,
    ecoTips: user.ecoTips, // now dynamic
    challenges: user.challenges, // now dynamic
  });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, notifications, ecoInterests } = await req.json();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { name, notifications, ecoInterests },
    { new: true }
  );
  return NextResponse.json({
    email: user.email,
    name: user.name,
    notifications: user.notifications,
    ecoInterests: user.ecoInterests,
  });
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await User.deleteOne({ email: session.user.email });
  return NextResponse.json({ success: true });
} 

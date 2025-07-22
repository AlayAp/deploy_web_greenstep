import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Challenge } from "@/lib/ChallengeModel";
import { User } from "@/lib/userModel";

// ✅ GET /api/challenges - return all challenges (public)
export async function GET(_req: NextRequest) {
  await dbConnect();

  try {
    const challenges = await Challenge.find({});

    // Format and sanitize for front-end display
    const formatted = challenges.map((c) => ({
      id: c.id ?? c._id?.toString(),
      title: c.title,
      category: c.category,
      type: c.type,
      description: c.description,
      daysLeft: Number(c.daysLeft ?? 0),
      progress: Number(c.progress ?? 0),
      total: Number(c.total ?? 0),
      status: c.status ?? 'Ongoing',
    }));

    return NextResponse.json(formatted);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}

// ✅ POST /api/challenges - create user-specific challenge
export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const newChallenge = new Challenge({
      ...data,
      userEmail: session.user?.email,
    });

    const saved = await newChallenge.save();

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { challenges: 1 } },
      { new: true }
    );

    return NextResponse.json(saved, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Challenge creation failed" }, { status: 500 });
  }
}

// ✅ PUT /api/challenges?id=xyz - update challenge (user-auth)
export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const id = req.nextUrl.searchParams.get("id");

  if (!session?.user?.email || !id) {
    return NextResponse.json({ error: "Unauthorized or missing ID" }, { status: 400 });
  }

  try {
    const data = await req.json();

    const updated = await Challenge.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Challenge update failed" }, { status: 500 });
  }
}

// ✅ DELETE /api/challenges?id=xyz - remove user's challenge
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const id = req.nextUrl.searchParams.get("id");

  if (!session?.user?.email || !id) {
    return NextResponse.json({ error: "Unauthorized or missing ID" }, { status: 400 });
  }

  try {
    await Challenge.deleteOne({ _id: id, userEmail: session.user.email });

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $inc: { challenges: -1 } }
    );

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

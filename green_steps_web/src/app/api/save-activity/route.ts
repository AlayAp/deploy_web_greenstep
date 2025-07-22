// app/api/save-activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import EcoActivity from "@/app/models/EcoActivity";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newActivity = new EcoActivity({
      userEmail: body.userEmail,
      activityType: body.activityType,
      co2Saved: body.co2Saved,
    });

    const saved = await newActivity.save();
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error saving activity:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}

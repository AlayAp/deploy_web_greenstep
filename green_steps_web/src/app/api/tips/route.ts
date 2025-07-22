import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import { Tip } from '@/lib/tipModel';
import { Types } from 'mongoose';

export async function GET(req: NextRequest) {
  await dbConnect();
  const region = req.nextUrl.searchParams.get('region');
  const tips = await Tip.find(region ? { region } : {}).sort({ createdAt: -1 });
  return NextResponse.json(tips);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const tip = await Tip.create({
    ...body,
    createdAt: new Date(),
  });
  return NextResponse.json(tip);
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { _id, ...update } = body;
  const tip = await Tip.findByIdAndUpdate(_id, update, { new: true });
  return NextResponse.json(tip);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { _id } = await req.json();
  if (!_id || !Types.ObjectId.isValid(_id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  await Tip.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}


 
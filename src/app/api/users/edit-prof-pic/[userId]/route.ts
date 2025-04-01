import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const { newImage: image } = await request.json();
  await connect();
  await User.findByIdAndUpdate(userId, { $set: { image } });
  return NextResponse.json(
    { message: "Updated Profile Picture" },
    { status: 200 }
  );
}

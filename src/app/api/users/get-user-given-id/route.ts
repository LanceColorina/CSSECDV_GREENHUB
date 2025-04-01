import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const userId = searchParams.get("userId");
    const user = await User.findOne({ _id: userId }).select("-password").lean();

    return NextResponse.json({ message: "User Found", data: user });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    connect();
    const url = new URL(request.nextUrl);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      throw new Error("User ID not provided in query parameters");
    }

    const user = await User.findOne({ _id: userId });
    return NextResponse.json({ user });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

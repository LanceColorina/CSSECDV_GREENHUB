import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData || !tokenData.id) {
      return NextResponse.json(
        { error: "Invalid token or missing user ID" },
        { status: 400 }
      );
    }

    const userId = tokenData.id;
    const user = await User.findOne({ _id: userId }).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User Found", data: user });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

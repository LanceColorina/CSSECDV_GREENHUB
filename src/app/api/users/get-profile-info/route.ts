import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const tokenData = getDataFromToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Token data is null" },
        { status: 400 }
      );
    }

    const userId = tokenData.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

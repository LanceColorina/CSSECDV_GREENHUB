import User from "@/models/User";
import connect from "@/utils/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    await connect();

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const bio = searchParams.get("bio");

    const userId = getDataFromToken(req).id;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { bio: bio },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

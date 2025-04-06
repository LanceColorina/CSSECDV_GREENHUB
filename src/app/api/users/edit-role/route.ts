import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const { id, role } = await req.json();

    if (!id || !role) {
      return NextResponse.json({ success: false, message: "User ID and role are required" }, { status: 400 });
    }

    if (!["admin", "user", "viewer"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

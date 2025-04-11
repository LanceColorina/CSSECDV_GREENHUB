import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User"; 

export async function POST(req: NextRequest) {
  const { userId, currentPassword, newPassword, securityQuestionAnswer } = await req.json();

  // Check if all required fields are provided
  if (!userId || !currentPassword || !newPassword || !securityQuestionAnswer) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  try {
    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify the answer to the security question
    if (user.securityQuestionAnswer !== securityQuestionAnswer) {
      return NextResponse.json({ message: "Security question answer is incorrect" }, { status: 400 });
    }

    // Verify the current password by comparing it with the stored password hash
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 5);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Respond with success
    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error changing password" }, { status: 500 });
  }
}


// app/api/users/verify-security-answers/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, answers } = await request.json();

    if (!email || !answers || !answers.answer1 || !answers.answer2 || !answers.answer3) {
      return NextResponse.json(
        { error: "Email and all answers are required" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findOne({ email }).select("+securityQuestions.question1.answer +securityQuestions.question2.answer +securityQuestions.question3.answer");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.securityQuestions) {
      return NextResponse.json(
        { error: "Security questions not set up for this user" },
        { status: 400 }
      );
    }

    // Verify all answers
    const isAnswer1Valid = await bcrypt.compare(answers.answer1, user.securityQuestions.question1.answer);
    const isAnswer2Valid = await bcrypt.compare(answers.answer2, user.securityQuestions.question2.answer);
    const isAnswer3Valid = await bcrypt.compare(answers.answer3, user.securityQuestions.question3.answer);

    if (!isAnswer1Valid || !isAnswer2Valid || !isAnswer3Valid) {
      return NextResponse.json(
        { error: "One or more answers are incorrect" },
        { status: 401 }
      );
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();

    return NextResponse.json(
      { 
        success: true,
        token: resetToken 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error verifying security answers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
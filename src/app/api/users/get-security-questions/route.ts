// app/api/users/get-security-questions/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import connect from "@/utils/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findOne({ email }).select("securityQuestions");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.securityQuestions) {
      return NextResponse.json(
        { error: "Security questions not set up for this user" },
        { status: 404 }
      );
    }

    // Return only the questions (not the answers) in order
    const questions = {
      question1: user.securityQuestions.question1.question,
      question2: user.securityQuestions.question2.question,
      question3: user.securityQuestions.question3.question,
    };

    return NextResponse.json(questions, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
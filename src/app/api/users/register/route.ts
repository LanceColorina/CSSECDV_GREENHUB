import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const body = await request.json();
  const { 
    firstName, 
    lastName, 
    username, 
    email, 
    password, 
    bio,
    securityQuestions 
  } = body;

  await connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  let role = "viewer";
  if (email.endsWith("@dlsu.edu.ph")) {
    role = "user";
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const lastPasswordReset = new Date();
  
  // Hash the security question answers
  const hashedSecurityQuestions = {
    question1: {
      question: securityQuestions.question1.question,
      answer: await bcrypt.hash(securityQuestions.question1.answer, 5)
    },
    question2: {
      question: securityQuestions.question2.question,
      answer: await bcrypt.hash(securityQuestions.question2.answer, 5)
    },
    question3: {
      question: securityQuestions.question3.question,
      answer: await bcrypt.hash(securityQuestions.question3.answer, 5)
    }
  };

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    bio,
    role,
    securityQuestions: hashedSecurityQuestions,
    lastPasswordReset
  });

  try {
    await newUser.save();
    return new NextResponse("User is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
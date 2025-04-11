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

  // 1. Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  // 2. Check if password is being reused from other accounts
  const allUsers = await User.find({}).select('password');
  let isPasswordReused = false;

  // Compare against all existing hashed passwords
  for (const user of allUsers) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      isPasswordReused = true;
      break;
    }
  }

  if (isPasswordReused) {
    return new NextResponse(
      "This password has been used by another account. Please choose a different password.", 
      { status: 400 }
    );
  }

  let role = "viewer";
  if (email.endsWith("@dlsu.edu.ph")) {
    role = "user";
  }

  // 3. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10); // Increased salt rounds to 10
  const lastPasswordReset = new Date();
  
  // 4. Hash the security question answers
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

  // 5. Create new user
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
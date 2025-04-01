import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const body = await request.json();
  const { firstName, lastName, username, email, password, bio } = body;

  await connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }
  let role = "viewer";

  if (email.endsWith("@dlsu.edu.ph")) {
    role = "user"; // You can adjust this logic to fit your needs
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    bio,
    role
  });

  try {
    await newUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};

import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (request: any) => {
  try {
    const body = await request.json();
    const { email, password, userChoosesRememberMe } = body;

    await connect();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse("User does not exist", { status: 400 });
    }
    console.log("hello world");

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new NextResponse("Incorrect password", { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
    };

    const rememberMePeriod = "21d";

    const expiresIn = userChoosesRememberMe ? rememberMePeriod : "3d";

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: expiresIn,
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: false,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};

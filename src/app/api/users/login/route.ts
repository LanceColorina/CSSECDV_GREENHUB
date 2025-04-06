import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const MAX_FAILED_ATTEMPTS = 5; // Max attempts before lockout
const LOCK_TIME = 30 * 60 * 1000; // Lockout time in milliseconds (30 minutes)

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password, userChoosesRememberMe } = body;

    await connect();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User  does not exist" }),
        { status: 400 }
      );
    }

    // Check if the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return new NextResponse(
        JSON.stringify({
          message: `Account is temporarily locked. Please try again after 30 mins.`, lockUntil : user.lockUntil
        }),
        { status: 403 },
      );
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // If the number of failed attempts exceeds the max, lock the account
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME; // Lock account for the specified period
      }

      await user.save();

      return new NextResponse(
        JSON.stringify({ message: "Invalid username and/or password" }),
        { status: 400 }
      );
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null; // Remove lock
    await user.save();

    // Create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      role: user.role,
    };

    const rememberMePeriod = "21d";
    const expiresIn = userChoosesRememberMe ? rememberMePeriod : "3d";

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: expiresIn,
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      token, // Include the token in the response
    });

    response.cookies.set("token", token, {
      httpOnly: false,
      path: "/",
      maxAge: userChoosesRememberMe ? 60 * 60 * 24 * 21 : 60 * 60 * 24 * 3, // Set cookie expiration based on remember me
    });

    return response;
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

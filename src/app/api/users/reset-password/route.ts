// app/api/users/reset-password/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/User';
import connect from '@/utils/db';
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/helpers/alertEmail";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    const sendResetFailureEmail = async (email: string) => {
      await sendEmail({
        to: email,
        subject: "Password Reset Attempt Failed",
        text: "A password reset was attempted using your email, but the reset token was invalid or expired. If you didn't request this, you can ignore this message.",
      });
    };
    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    await connect();

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiry: { $gt: Date.now() }
    }).select('+password'); // Include password field for comparison

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Verify new password meets complexity requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      sendResetFailureEmail(user.email);
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    // Check if new password matches current password
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      sendResetFailureEmail(user.email);
      return NextResponse.json(
        { error: 'New password cannot be the same as your current password' },
        { status: 400 }
      );
    }

    // Check against previous passwords (if you store password history)
    if (user.previousPasswords) {
      for (const oldHash of user.previousPasswords) {
        const isMatch = await bcrypt.compare(newPassword, oldHash);
        if (isMatch) {
          sendResetFailureEmail(user.email);
          return NextResponse.json(
            { error: 'You cannot reuse a previously used password' },
            { status: 400 }
          );
        }
      }
    }

    // Check against other users' passwords (like in registration)
    const allUsers = await User.find({ _id: { $ne: user._id } }).select('password');
    for (const otherUser of allUsers) {
      
      const isMatch = await bcrypt.compare(newPassword, otherUser.password);
      if (isMatch) {
        sendResetFailureEmail(user.email);
        return NextResponse.json(
          { error: 'This password is already in use by another account' },
          { status: 400 }
        );
      }
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user with new password and clear reset token
    user.password = hashedPassword;
    user.lastPasswordReset = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    user.failedLoginAttempts = 0;
    
    // Add to password history (if implemented)
    if (user.previousPasswords) {
      user.previousPasswords.push(user.password); // Store old hash before updating
      if (user.previousPasswords.length > 5) { // Keep last 5 passwords
        user.previousPasswords.shift();
      }
    }

    await user.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password has been reset successfully' 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

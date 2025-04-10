// app/reset-password/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import "../../../../styles/registration.css";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8;
    const complexityValid =
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthValid && complexityValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters long and include an uppercase and lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error(data.error || "Password reset failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <h1>Invalid Reset Link</h1>
        <p>The password reset link is invalid or has expired.</p>
        <p className="note">
          <Link href="/forgot-password">Request a new reset link</Link>
        </p>
        <p className="home-link">
          <Link href="/" replace>
            <i className="bi bi-house-door-fill"></i>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="login-container">
        <h1>{loading ? "Processing..." : "Reset Password"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              placeholder="Enter new password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button-registration" disabled={loading}>
            Reset Password
          </button>
        </form>
        <p className="note">
          Remember your password? <Link href="/login">Login</Link>
        </p>
        <p className="home-link">
          <Link href="/" replace>
            <i className="bi bi-house-door-fill"></i>
          </Link>
        </p>
      </div>
    </>
  );
}
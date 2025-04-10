"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import "../../../../../styles/registration.css";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe");

    // ✅ 2.4.5 Log input validation failures
    if (!email || !password) {
      toast.error("Email and password are required.");
      console.warn(`[VALIDATION ERROR] Missing email or password at ${new Date().toISOString()}`);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", {
        email,
        password,
        rememberMe,
      });

      // ✅ 2.4.3: Log successful login
      // router.prefetch("/");
      console.log("Login successful for:", email);
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      
      if (error.response) {
        const { status, data } = error.response;
        console.log(data.lockUntil);

        if (status === 403 && data.message.includes("Account is temporarily locked")) {
          // ✅ 2.4.2: Generic message
          toast.error(`Your account is temporarily locked.  Please try again after ${new Date(data.lockUntil).toLocaleString()}.`);
          // ✅ 2.4.3 & 2.4.6: Log security failure
          console.warn(`[SECURITY EVENT] Locked account login attempt: ${email} at ${new Date().toISOString()}`);
        } else {
          toast.error("Invalid login credentials. Please try again.");
          // ✅ 2.4.6: Log auth failure
          console.warn(`[AUTH FAILURE] Failed login attempt for email: ${email}`);
        }
      } else {
        // ✅ 2.4.1: Generic message
        toast.error("Something went wrong. Please try again later."); 
        // ✅ 2.4.1: Hide stack trace from user
        console.error(`[SERVER ERROR] Login request failed at ${new Date().toISOString()}:`, error.message);
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="login-container">
        <h1>{loading ? "Processing..." : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="Email">Email</label>
            <input
              id="Email"
              placeholder="Enter email"
              type="text"
              name="email"
              required
            />
          </div>
          <div className="field password-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Enter password"
              type="password"
              name="password"
              required
            />
            <Link href="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          <div className="other-options">
            <div>
              <input
                id="rememberMeCheckbox"
                type="checkbox"
                name="rememberMe"
              />
              <label htmlFor="rememberMeCheckbox">Remember me</label>
            </div>
          </div>
          <button type="submit" className="button-registration" disabled={loading}>
            Log in
          </button>
        </form>
        <p className="note">
          Do not have an account? <Link href="/signup">Sign up</Link>
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
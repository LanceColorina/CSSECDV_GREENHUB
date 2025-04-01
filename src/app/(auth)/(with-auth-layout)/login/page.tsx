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

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", {
        email,
        password,
        rememberMe,
      });
      console.log("Login success", response.data);
      router.push("/");
    } catch (error: any) {
      // Check if the error response exists and handle it accordingly
      if (error.response) {
        const { status, data } = error.response;

        // Handle locked account
        if (status === 403 && data.message.includes("Account is temporarily locked")) {
          toast.error(`Account is temporarily locked. Please try again after ${new Date(data.lockUntil).toLocaleString()}.`);
        } else {
          // Handle other errors (e.g., invalid credentials)
          toast.error(data.message || "Invalid username and/or password");
        }
      } else {
        // Handle network errors or other unexpected errors
        toast.error("An unexpected error occurred. Please try again later.");
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
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Enter password"
              type="password"
              name="password"
              required
            />
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
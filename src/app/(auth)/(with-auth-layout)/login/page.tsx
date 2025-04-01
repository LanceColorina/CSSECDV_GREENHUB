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
      toast.error("Invalid username and/or password");
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
        <form action="" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="Email">Email</label>
            <input
              id="Email"
              placeholder="Enter email"
              type="text"
              name="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Enter password"
              type="password"
              name="password"
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
          <button type="submit" className="button-registration">
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

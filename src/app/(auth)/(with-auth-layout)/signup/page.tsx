"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../../styles/registration.css";

export default function Signup() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const res = await fetch("/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          bio: " ",
        }),
      });

      if (res.status === 400) {
        setError("This email is already registered");
      }

      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error try again");
      console.log(error);
    }
  }

  return (
    <>
      <div className="login-container">
        <h1>Sign up</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="grid">
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                placeholder="Enter first name"
                type="text"
                name="firstName"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                placeholder="Enter last name"
                type="text"
                name="lastName"
                required
              />
            </div>
          </div>
          <div className="grid">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                placeholder="Enter username"
                type="text"
                name="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Enter email"
                type="email"
                name="email"
                required
              />
            </div>
          </div>
          <div className="grid">
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
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                required
              />
            </div>
          </div>
          <button type="submit" className="button-registration">
            Create Account
          </button>
          <p style={{ textAlign: "center", color: "red" }}>{error && error}</p>
        </form>
        <p className="note">
          Already have an account? <Link href="/login">Login</Link>
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

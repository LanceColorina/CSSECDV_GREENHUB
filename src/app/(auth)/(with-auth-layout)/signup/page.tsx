"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../../styles/registration.css";

export default function Signup() {
  const [error, setError] = useState("");
  const router = useRouter();

  const securityQuestions = [
    "What is your favourite food?",
    "What is your mother's maiden name?",
    "What is the name of your first pet?",
    "What is your favourite artist?",
    "What is your childhood dream?"
  ];

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 8;
    const complexityValid =
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthValid && complexityValid;
  };
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword");
    
    // Get security questions
    const securityQuestions = {
      question1: {
        question: formData.get("securityQuestion1"),
        answer: formData.get("securityAnswer1")
      },
      question2: {
        question: formData.get("securityQuestion2"),
        answer: formData.get("securityAnswer2")
      },
      question3: {
        question: formData.get("securityQuestion3"),
        answer: formData.get("securityAnswer3")
      }
    };

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include an uppercase and lowercase letter, a number, and a special character."
      );
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
          securityQuestions
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

          {/* Security Questions Section */}
          <div className="security-questions">
            <h3>Security Questions</h3>
            <p>These will be used to verify your identity if you forget your password.</p>
            
            {/* Question 1 */}
            <div className="field">
              <label htmlFor="securityQuestion1">Security Question 1</label>
              <select 
                id="securityQuestion1" 
                name="securityQuestion1" 
                required
                className="security-question-select"
              >
                <option value="">Select a question</option>
                {securityQuestions.map((question, index) => (
                  <option key={`q1-${index}`} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                name="securityAnswer1"
                required
                className="security-answer-input"
              />
            </div>

            {/* Question 2 */}
            <div className="field">
              <label htmlFor="securityQuestion2">Security Question 2</label>
              <select 
                id="securityQuestion2" 
                name="securityQuestion2" 
                required
                className="security-question-select"
              >
                <option value="">Select a question</option>
                {securityQuestions.map((question, index) => (
                  <option key={`q2-${index}`} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                name="securityAnswer2"
                required
                className="security-answer-input"
              />
            </div>

            {/* Question 3 */}
            <div className="field">
              <label htmlFor="securityQuestion3">Security Question 3</label>
              <select 
                id="securityQuestion3" 
                name="securityQuestion3" 
                required
                className="security-question-select"
              >
                <option value="">Select a question</option>
                {securityQuestions.map((question, index) => (
                  <option key={`q3-${index}`} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                name="securityAnswer3"
                required
                className="security-answer-input"
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
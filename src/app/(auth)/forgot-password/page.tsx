// app/forgot-password/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import "../../../../styles/registration.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<{
    question1: string;
    question2: string;
    question3: string;
  } | null>(null);
  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
  });

  const handleGetQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/users/get-security-questions?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (res.status === 200) {
        setQuestions(data);
      } else {
        toast.error(data.error || "Failed to get security questions");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questions || !answers.answer1 || !answers.answer2 || !answers.answer3) {
      toast.error("Please answer all security questions");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/verify-security-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          answers,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success("Answers verified successfully");
        router.push(`/reset-password?token=${data.token}`);
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="login-container">
        <h1>{loading ? "Processing..." : "Password Reset"}</h1>

        {!questions ? (
          <form onSubmit={handleGetQuestions}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button-registration" disabled={loading}>
              Get Security Questions
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitAnswers}>
            <div className="security-questions">
              <h3>Answer Your Security Questions</h3>
              <p>Please answer all questions to verify your identity.</p>

              <div className="field">
                <label htmlFor="answer1">{questions.question1}</label>
                <input
                  id="answer1"
                  type="text"
                  value={answers.answer1}
                  onChange={(e) =>
                    setAnswers({ ...answers, answer1: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="answer2">{questions.question2}</label>
                <input
                  id="answer2"
                  type="text"
                  value={answers.answer2}
                  onChange={(e) =>
                    setAnswers({ ...answers, answer2: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="answer3">{questions.question3}</label>
                <input
                  id="answer3"
                  type="text"
                  value={answers.answer3}
                  onChange={(e) =>
                    setAnswers({ ...answers, answer3: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="button-registration" disabled={loading}>
              Verify Answers
            </button>
          </form>
        )}

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
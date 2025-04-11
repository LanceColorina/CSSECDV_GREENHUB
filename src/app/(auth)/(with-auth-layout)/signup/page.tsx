"use client";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../../styles/registration.css";

export default function Signup() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} is required`;
        } else if (value.length > 50) {
          errors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} cannot exceed 50 characters`;
        }
        break;
      
      case 'username':
        if (!value.trim()) {
          errors.username = 'Username is required';
        } else if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters long';
        } else if (value.length > 30) {
          errors.username = 'Username cannot exceed 30 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers and underscores';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      
      case 'password':
        if (!validatePassword(value)) {
          errors.password = 'Password must be at least 8 characters long and include an uppercase and lowercase letter, a number, and a special character';
        }
        break;
      
      case 'confirmPassword':
        const password = (document.querySelector('input[name="password"]') as HTMLInputElement)?.value;
        if (value !== password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      
      case 'securityAnswer1':
      case 'securityAnswer2':
      case 'securityAnswer3':
        if (!value.trim()) {
          errors[name] = 'Answer is required';
        } else if (value.trim().length < 2) {
          errors[name] = 'Answer must be at least 2 characters long';
        }
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (fieldErrors[name]) {
      validateField(name, value);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate all fields before submission
    let isValid = true;
    for (const [name, value] of Object.entries(formValues)) {
      if (typeof value === 'string') {
        isValid = validateField(name, value) && isValid;
      }
    }

    if (!isValid) {
      setError("Please correct the errors in the form");
      return;
    }

    const { 
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      securityQuestion1,
      securityQuestion2,
      securityQuestion3,
      securityAnswer1,
      securityAnswer2,
      securityAnswer3
    } = formValues;

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
          securityQuestions: {
            question1: {
              question: securityQuestion1,
              answer: securityAnswer1
            },
            question2: {
              question: securityQuestion2,
              answer: securityAnswer2
            },
            question3: {
              question: securityQuestion3,
              answer: securityAnswer3
            }
          }
        }),
      });

      if (res.status === 400) {
        const data = await res.json();
        setError(data.message || "This email is already registered");
      }

      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, please try again");
      console.error(error);
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
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.firstName && <span className="error-message">{fieldErrors.firstName}</span>}
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                placeholder="Enter last name"
                type="text"
                name="lastName"
                required
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.lastName && <span className="error-message">{fieldErrors.lastName}</span>}
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
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.username && <span className="error-message">{fieldErrors.username}</span>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Enter email"
                type="email"
                name="email"
                required
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
            </div>
          </div>
          <div className="grid">
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                placeholder="Enter password (min 8 chars with uppercase, lowercase, number & special char)"
                type="password"
                name="password"
                required
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                required
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.confirmPassword && <span className="error-message">{fieldErrors.confirmPassword}</span>}
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
                placeholder="Your answer (min 2 characters)"
                name="securityAnswer1"
                required
                className="security-answer-input"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.securityAnswer1 && <span className="error-message">{fieldErrors.securityAnswer1}</span>}
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
                placeholder="Your answer (min 2 characters)"
                name="securityAnswer2"
                required
                className="security-answer-input"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.securityAnswer2 && <span className="error-message">{fieldErrors.securityAnswer2}</span>}
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
                placeholder="Your answer (min 2 characters)"
                name="securityAnswer3"
                required
                className="security-answer-input"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {fieldErrors.securityAnswer3 && <span className="error-message">{fieldErrors.securityAnswer3}</span>}
            </div>
          </div>

          <button type="submit" className="button-registration">
            Create Account
          </button>
          {(error || Object.keys(fieldErrors).length > 0) && (
            <p style={{ textAlign: "center", color: "red" }}>
              {error || "Please fix the errors in the form"}
            </p>
          )}
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
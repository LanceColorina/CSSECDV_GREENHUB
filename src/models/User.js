import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    bio: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "viewer"],
      default: "viewer",
      required: true,
    },
    image: {
      type: [String],
      required: false,
      default: [
        "https://utfs.io/f/78e7af3d-1649-4e7e-aa89-de25e53b114f-566rf9.jpeg",
      ],
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    // Exactly 3 security questions in order (Question 1, Question 2, Question 3)
    securityQuestions: {
      question1: {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
      question2: {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
      question3: {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    },
    // Password reset tracking
    passwordResetAttempts: { type: Number, default: 0 },
    lastPasswordReset: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

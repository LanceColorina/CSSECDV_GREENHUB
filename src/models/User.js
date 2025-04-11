import mongoose from "mongoose";

const { Schema } = mongoose;

const validatePassword = (password) => {
  const lengthValid = password.length >= 8;
  const complexityValid =
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return lengthValid && complexityValid;
};

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: validatePassword,
        message:
          "Password must be at least 8 characters long and include an uppercase and lowercase letter, a number, and a special character",
      },
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user", "viewer"],
        message: "Role must be either 'admin', 'user', or 'viewer'",
      },
      default: "viewer",
      required: [true, "Role is required"],
    },
    image: {
      type: [String],
      required: false,
      default: [
        "https://utfs.io/f/78e7af3d-1649-4e7e-aa89-de25e53b114f-566rf9.jpeg",
      ],
      validate: {
        validator: (images) => images.length <= 5,
        message: "Cannot have more than 5 profile images",
      },
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: [0, "Failed login attempts cannot be negative"],
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    securityQuestions: {
      question1: {
        question: {
          type: String,
          required: [true, "Security question 1 is required"],
          trim: true,
          minlength: [
            10,
            "Security question must be at least 10 characters long",
          ],
        },
        answer: {
          type: String,
          required: [true, "Answer for question 1 is required"],
          trim: true,
          minlength: [2, "Answer must be at least 2 characters long"],
        },
      },
      question2: {
        question: {
          type: String,
          required: [true, "Security question 2 is required"],
          trim: true,
          minlength: [
            10,
            "Security question must be at least 10 characters long",
          ],
        },
        answer: {
          type: String,
          required: [true, "Answer for question 2 is required"],
          trim: true,
          minlength: [2, "Answer must be at least 2 characters long"],
        },
      },
      question3: {
        question: {
          type: String,
          required: [true, "Security question 3 is required"],
          trim: true,
          minlength: [
            10,
            "Security question must be at least 10 characters long",
          ],
        },
        answer: {
          type: String,
          required: [true, "Answer for question 3 is required"],
          trim: true,
          minlength: [2, "Answer must be at least 2 characters long"],
        },
      },
    },
    passwordResetAttempts: {
      type: Number,
      default: 0,
      min: [0, "Password reset attempts cannot be negative"],
    },
    lastPasswordReset: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.securityQuestions;
        delete ret.failedLoginAttempts;
        delete ret.lockUntil;
        delete ret.passwordResetAttempts;
        delete ret.lastPasswordReset;
        delete ret.passwordResetToken;
        delete ret.passwordResetTokenExpiry;
        return ret;
      },
    },
  }
);

// Add index for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);

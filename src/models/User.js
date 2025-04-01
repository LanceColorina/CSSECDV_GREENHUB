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
      enum: ["admin", "user", "viewer"], // Restricts to these values
      default: "viewer", // Default role if none is specified
      required: true,
    },
    image: {
      type: [String],
      required: false,
      default: [
        "https://utfs.io/f/78e7af3d-1649-4e7e-aa89-de25e53b114f-566rf9.jpeg",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    title: { type: String, required: true },
    username: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String, required: true }],
    image: [{ type: String, required: false }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    numLikes: { type: Number, default: 0 },
    numDislikes: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isReported: {type: Boolean, default: false},
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", userSchema);

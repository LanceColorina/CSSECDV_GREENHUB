import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    username: { type: String, required: true },
    commenterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);

import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment must be at least 1 character long"],
      maxlength: [5000, "Comment cannot exceed 5000 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      validate: {
        validator: (username) => {
          return /^[a-zA-Z0-9_]{3,30}$/.test(username);
        },
        message:
          "Username must be 3-30 characters and can only contain letters, numbers, and underscores",
      },
    },
    commenterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Commenter ID is required"],
      validate: {
        validator: (id) => {
          return mongoose.Types.ObjectId.isValid(id);
        },
        message: "Invalid user reference",
      },
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post ID is required"],
      validate: {
        validator: (id) => {
          return mongoose.Types.ObjectId.isValid(id);
        },
        message: "Invalid post reference",
      },
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Remove sensitive/internal fields when converting to JSON
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Add indexes for better query performance
commentSchema.index({ postId: 1 }); // For quickly finding all comments for a post
commentSchema.index({ commenterId: 1 }); // For finding all comments by a user
commentSchema.index({ createdAt: -1 }); // For sorting comments by newest first

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);

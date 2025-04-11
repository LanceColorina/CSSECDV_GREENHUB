import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
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
    body: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      minlength: [10, "Post content must be at least 10 characters long"],
      maxlength: [10000, "Post content cannot exceed 10,000 characters"],
    },
    tags: [
      {
        type: String,
        required: [true, "At least one tag is required"],
        trim: true,
        lowercase: true,
        validate: {
          validator: function (tag) {
            return /^[a-z0-9-]{2,20}$/.test(tag);
          },
          message:
            "Each tag must be 2-20 characters long and can only contain lowercase letters, numbers, and hyphens",
        },
      },
    ],
    image: [
      {
        type: String,
        required: false,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      validate: {
        validator: (id) => {
          return mongoose.Types.ObjectId.isValid(id);
        },
        message: "Invalid user reference",
      },
    },
    numLikes: {
      type: Number,
      default: 0,
      min: [0, "Like count cannot be negative"],
    },
    numDislikes: {
      type: Number,
      default: 0,
      min: [0, "Dislike count cannot be negative"],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Add indexes
postSchema.index({ title: "text", body: "text", tags: "text" });
postSchema.index({ user: 1 });
postSchema.index({ numLikes: -1 });
postSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model("Post", postSchema);

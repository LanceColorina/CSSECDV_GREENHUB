import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {

  try {
    const body = new URL(request.url);
    const searchParams = new URLSearchParams(body.searchParams);
    const postId = searchParams.get("postId");
    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { isReported: true},
        { new: true } 
      );
    if (!updatedPost) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ post: updatedPost });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
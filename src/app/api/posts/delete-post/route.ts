import Post from "@/models/Post";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  try {
    await connect();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const postId = searchParams.get("postId"); 
    const post = await Post.findOneAndDelete(
        { _id: postId },
    );
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
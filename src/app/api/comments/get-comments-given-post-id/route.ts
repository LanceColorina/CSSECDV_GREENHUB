import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {

  try {
    const body = new URL(request.url);
    const searchParams = new URLSearchParams(body.searchParams);
    const postId = searchParams.get("postId");
    const comments = await Comment.find({postId:postId});
    return new NextResponse(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
}
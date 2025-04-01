import Comment from "@/models/Comment";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  try {
    await connect();

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const postId = searchParams.get("postId");
    const prevContent = searchParams.get("prevcontent");
    const content = searchParams.get("content");
    const comment = await Comment.findOneAndUpdate(
      { postId: postId, content: prevContent },
      { content: content, isEdited: true },
      { new: true }
    );
    console.log("edited");
    return NextResponse.json({ comment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

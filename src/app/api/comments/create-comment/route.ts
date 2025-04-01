import Comment from "@/models/Comment";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const POST = async (request: any) => {
  const data = await request.json();
  const { content,postId} = data;

  await connect();

  const newComment = new Comment({
    content,
    username: getDataFromToken(request).username,
    commenterId: getDataFromToken(request).id,
    postId,
  });

  try {
    await newComment.save();
    return new NextResponse("New Comment created", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
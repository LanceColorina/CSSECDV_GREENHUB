import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request:NextRequest) {

  try {
    const comments = await Comment.find({commenterId:getDataFromToken(request).id});
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
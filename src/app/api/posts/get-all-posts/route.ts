import Post from "@/models/Post";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    // Check if 'search' parameter is present in the query
    const body = new URL(request.url);
    const searchParams = new URLSearchParams(body.searchParams);
    const search = searchParams.get("search");
    await connect();

    const posts = await Post.find({
      $or: [
        { title: { $regex: "", $options: "i" } }, // Case-insensitive search on title
        { body: { $regex: "", $options: "i" } }, // Case-insensitive search on body
      ],
    });

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
};

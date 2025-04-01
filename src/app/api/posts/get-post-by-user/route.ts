import Post from "@/models/Post";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
export const GET = async (request: any) => {
  try {
    // Check if 'search' parameter is present in the query

    await connect();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const user = searchParams.get("user");
    const posts = await Post.find({ user: user });

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
};

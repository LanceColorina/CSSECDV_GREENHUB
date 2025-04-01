import Post from "@/models/Post";
import connect from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const GET = async (request: NextRequest) => {
  try {
    await connect();

    const tokenData = getDataFromToken(request);

    if (tokenData && tokenData.id) {
      const posts = await Post.find({ user: tokenData.id });

      return new NextResponse(JSON.stringify(posts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ error: "Token data or user id is missing" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

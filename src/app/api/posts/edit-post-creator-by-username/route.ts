import Post from "@/models/Post";
import connect from "@/utils/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    await connect();
    

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const newName = searchParams.get("newName");
    const prevName = searchParams.get("prevName");


    const yes = await Post.updateMany({ username:prevName }, { username: newName });



    return NextResponse.json({ post: yes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
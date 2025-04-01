import Post from "@/models/Post";
import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const POST = async (request: any) => {
  const data = await request.json();
  const { title, body, tags, image } = data;

  await connect();
  const user = await User.findOne({ _id: getDataFromToken(request).id });
  const newPost = new Post({
    title,
    body,
    tags,
    image,
    user: getDataFromToken(request).id,
    username: user.username,
  });

  try {
    await newPost.save();
    return new NextResponse("New post created", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};


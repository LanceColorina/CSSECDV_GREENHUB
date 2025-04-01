"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Post {
  _id: string;
  user: string;
  username: string;
  title: string;
  body: string;
  tags: string[];
  numLikes: number;
  numDislikes: number;
  createdAt: number;
  isEdited: boolean;
}

export default function MyPosts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [numPosts, setNumPosts] = useState();
  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      const response = await axios.get("/api/posts/get-post-by-user-id");
      setNumPosts(response.data.length);
      setAllPosts(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  function getUTC(date: number) {
    return new Date(date).toUTCString();
  }

  return (
    <>
      <div id="myPostsContent" className="my-posts-content">
        <div className="my-posts-wrapper">
          <div>
            <h1>My Posts</h1>
            <span>
              You have <b>{numPosts}</b> posts
            </span>
          </div>
          <div>
            {allPosts.map((post) => (
              <Link href={`/view_post/${post._id}`} key={post._id}>
                <div className="post-container">
                  <div>
                    <span>
                      <i className="bi bi-calendar4-event"></i>{" "}
                      {getUTC(post.createdAt)}
                    </span>
                  </div>
                  <div>
                    <h1>{post.title}</h1>
                    <p>{post.body}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

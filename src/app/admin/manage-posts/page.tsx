"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Post {
  _id: string;
  user: string;
  username: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  numLikes: number;
  numDislikes: number;
  isEdited: boolean;
  isReported:boolean;
}

export default function ManagePosts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      const response = await axios.get("/api/posts/get-all-posts");
      setAllPosts(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const [editMode, setEditMode] = useState<string | null>(null); // Track which post is being edited


  const handleDelete = async (postId: string) => {
    try {
      await axios.get(`/api/posts/delete-post?postId=${postId}`);
      await axios.get(
        `/api/comments/delete-comment-by-post-id?postId=${postId}`
      );
      setAllPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Error updating post title:", error);
    }
  };



  return (
    <>
      <h2>Manage Posts</h2>
      <a href="/admin">Go back</a>

      <table id="postTable">
        <thead>
          <tr>
            <th>Post ID</th>
            <th>User</th>
            <th>Post Title</th>
            <th>Tag</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allPosts.map((post, index) => (
            <tr key={post._id}>
              <td>{index + 1}</td>
              <td>{post.username}</td>
              <td>
                {editMode === post._id ? (
                  <input
                    type="text"
                    defaultValue={post.title}
                    onChange={(e) =>
                      setAllPosts((prevPosts) =>
                        prevPosts.map((prevPost) =>
                          prevPost._id === post._id
                            ? { ...prevPost, title: e.target.value }
                            : prevPost
                        )
                      )
                    }
                  />
                ) : (
                  post.title
                )}
              </td>
              <td>
                {post.tags.map((tag, tagIndex) => (
                  <button key={tagIndex}>{tag}</button>
                ))}
              </td>
              <td>{post.createdAt}</td>
              <td>
                {!post.isReported ? (<></>):(<button
                    className="delete"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>) 
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

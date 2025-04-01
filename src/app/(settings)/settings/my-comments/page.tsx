"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Comment {
  _id: string;
  content: string;
  username: string;
  commenterId: string;
  postId: string;
  createdAt: number;
  isEdited: boolean;
}

export default function MyComments() {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [numComments, setNumComments] = useState();

  useEffect(() => {
    getAllComments();
  }, []);

  const getAllComments = async () => {
    try {
      const response = await axios.get(
        "/api/comments/get-comments-by-commenter-id"
      );
      setNumComments(response.data.length);
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  function getUTC(date: number) {
    return new Date(date).toUTCString();
  }
  return (
    <>
      <div id="myCommentsContent" className="my-comments-content">
        <div className="my-comments-wrapper">
          <div>
            <h1>My Comments</h1>
            <span>
              You made <b>{numComments}</b> comments
            </span>
          </div>

          <div>
            {allComments.map((comment) => (
              <Link
                key={comment._id}
                href={`/view_post/${comment.postId}`}
                className="removehyperlink"
              >
                <div className="comment-container">
                  <div>
                    <i className="bi bi-calendar4-event"></i>
                    <span>{getUTC(comment.createdAt)}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

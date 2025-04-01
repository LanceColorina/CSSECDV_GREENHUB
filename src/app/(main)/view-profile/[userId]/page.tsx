"use client";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Error from "next/error";
import "../../../../../styles/profile.css";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  image: string;
}

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

export default function ViewProfile({
  params,
}: {
  params: { userId: string };
}) {
  const [isLoading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User>();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [numPosts, setNumPosts] = useState();
  useEffect(() => {
    getAllPosts();
    getProfileInfo(params.userId);
  }, []);
  const getAllPosts = async () => {
    try {
      const response = await axios.get(
        `/api/posts/get-post-by-user?user=${params.userId}`
      );
      setNumPosts(response.data.length);
      setAllPosts(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  async function getProfileInfo(userId: String) {
    try {
      const response = await axios.get(
        `/api/users/get-user-profile?userId=${userId}`
      );
      setUserProfile(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  function getUTC(date: number) {
    return new Date(date).toUTCString();
  }
  return (
    <>
      <div className="profile-wrapper">
        <div>
          <img src={userProfile?.image} alt="" />
          <h3>{userProfile?.username}</h3>
          <p>{userProfile?.bio}</p>
          <br />
        </div>

        <div>
          {allPosts.map((post) => (
            <div className="post-container" key={post._id}>
              <a href={`/view_post/${post._id}`} className="removehyperlink">
                <div className="content">
                  <div className="horizontal">
                    <a
                      href={`/view-profile/${post.user}`}
                      className="post-account"
                    >
                      {post.username}
                    </a>
                    <div id="date">{getUTC(post.createdAt)}</div>
                  </div>
                  <h1>{post.title}</h1>
                  <div className="tags">
                    {post.tags.map((tag) => (
                      <div className="each-tag" key={tag}>
                        {tag}
                      </div>
                    ))}
                  </div>
                  <p>{post.body}</p>
                </div>
              </a>
              <div className="options">
                <button className="like">
                  <a>
                    <span className="like-change">
                      <i id="thumbs-up" className="bi bi-hand-thumbs-up"></i>
                    </span>
                    <span className="like-amount">{post.numLikes}</span>
                  </a>
                </button>
                <button className="dislike">
                  <a>
                    <span className="dislike-change">
                      <i
                        id="thumbs-down"
                        className="bi bi-hand-thumbs-down"
                      ></i>
                    </span>
                    <span className="dislike-amount">{post.numDislikes}</span>
                  </a>
                </button>
                <button className="comment">
                  <a>
                    <i className="bi bi-chat-dots"></i>
                    Comments
                  </a>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

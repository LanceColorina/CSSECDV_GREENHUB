"use client";
import React, { useEffect, useState, FormEvent } from "react";
import "../../../styles/mainhub.css";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

interface Post {
  _id: string;
  user: string;
  image: string;
  username: string;
  title: string;
  body: string;
  tags: string[];
  numLikes: number;
  numDislikes: number;
  isEdited: boolean;
  createdAt: string;
}
  
export default function Home() {
  const cookies = useCookies();
  const token = cookies.get("token");
  const isAuthenticated = Boolean(token);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [displayedPostsCount, setDisplayedPostsCount] = useState<number>(15);
  const [postsort, setPostSort] = useState<String>("");

  // Function to delete expired tokens from local storage or cookies
  const deleteExpiredTokens = () => {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "[]");
    const currentTime = Date.now() / 1000;
    const validTokens = tokens.filter(
      (token: any) => token.expiry > currentTime
    );
    localStorage.setItem("tokens", JSON.stringify(validTokens));
  };

  const TokenCleanup: React.FC = () => {
   useEffect(() => {
      const interval = setInterval(deleteExpiredTokens, 3600000);
      return () => clearInterval(interval);
    }, []);

    return null;
  };

 useEffect(() => {
   getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      const response = await axios.get("/api/posts/get-all-posts?param=none");
      setAllPosts(response.data);
      setVisiblePosts(response.data.slice(0, displayedPostsCount));
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
    }
  };
  const getPostByDate = async () => {
    try {
       const response = await axios.get("/api/posts/get-all-post-by-date?param=none");
      setAllPosts(response.data);
      setVisiblePosts(response.data);
      console.log(response.data);
      setPostSort("Latest");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getPostByLike = async () => {
    try {
      const response = await axios.get("/api/posts/get-all-post-by-like?param=none");
      setAllPosts(response.data);
      setVisiblePosts(response.data);
      setPostSort("Popular");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  async function getUser(userId: String) {
    try {
      const response = await axios.get(
        `/api/users/get-user-given-id?userId=${userId}`
      );
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const loadMorePosts = () => {
    const newCount = displayedPostsCount + 15;
    setVisiblePosts(allPosts.slice(0, newCount));
    setDisplayedPostsCount(newCount);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const search = formData.get("search");

    try {
      console.log("go");
      const response = await axios.get(
        `/api/posts/search-posts?search=${search}`
      );
      console.log("Search successful", response.data);
      setAllPosts(response.data);
      setVisiblePosts(response.data);
    } catch (error: any) {
      console.log("Search failed", error.response.data);
      toast.error(error.response.data);
    } finally {
    }
  }

  function imageExists(image: string) {
    return image != "" ? true : false;
  }

  function getUTC(date: string) {
    return new Date(date).toUTCString();
  }

  return (
    <>
      <TokenCleanup />
      <div className="main-wrapper">
        <section>
          <button id="scrollup-button" onClick={scrollup}>
            <i className="bi bi-arrow-up"></i>
          </button>

          <div>
            {isAuthenticated ? (
              <Link href="/create_post" className="create-post-btn">
                <div>
                  <i className="bi bi-pencil-square"></i> Create Post
                </div>{" "}
              </Link>
            ) : (
              <Link href="/login" className="create-post-btn">
                <div>Log in to create a post</div>
              </Link>
            )}
          </div>

          <div className="sort-posts-container">
            <button className="sort-button" onClick={getPostByDate}>
              <i className="bi bi-stars"></i> Latest
            </button>
            <button className="sort-button" onClick={getPostByLike}>
              <i className="bi bi-fire"></i> Popular
            </button>
          </div>
          <hr></hr>
          <h1 className="search-and-latest">
            <i className="bi bi-stars"></i> {postsort} Post
          </h1>
          <form
            className="search-bar"
            id="search-align"
            action=""
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="search"
              id="textbox"
              placeholder="Search here..."
            />
            <button>
              <i className="bi bi-search"></i>
            </button>
          </form>
          <br />
          <div className="posts-wrapper">
            {visiblePosts.map((post) => (
              <div className="posts-container" key={post._id}>
                <a href={`/view_post/${post._id}`} className="removehyperlink">
                  <div className="content">
                    <div>
                      <a
                        href={`/view-profile/${post.user}`}
                        className="post-account"
                      >
                        <i className="bi bi-person-circle"></i>
                        <span>{post.username}</span>
                      </a>
                      <span>{getUTC(post.createdAt)}</span>
                    </div>
                    <div className="h1-title">{post.title}</div>
                    <div className="tags">
                      {post.tags.map((tag) => (
                        <div className="each-tag" key={tag}>
                          {tag}
                        </div>
                      ))}
                    </div>
                     {imageExists(post.image) && (
                      <img
                        src={post.image}
                        alt={""}
                        className="postImageOnHomepage"
                      />
                    )}
                    <div className="p-body">{post.body}</div>
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
          <div>
            <center>
              {visiblePosts.length < allPosts.length ? (
                <button className="btn-primary" onClick={loadMorePosts}>
                  Load More
                </button>
              ) : (
                <span>No more posts to show.</span>
              )}
              <br />
              <br />
            </center>
          </div>
        </section>
      </div>
    </>
  );
}


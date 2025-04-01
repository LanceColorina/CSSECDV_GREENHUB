"use client";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Error from "next/error";
import "../../../../../styles/view_post.css";
import toast from "react-hot-toast";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
interface Comment {
  _id: string;
  content: string;
  username: string;
  commenterId: string;
  postId: string;
  isEdited: boolean;
}
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
}
export default function ViewPost({ params }: { params: { postId: string } }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [allComment, setAllComments] = useState<Comment[]>([]);
  const [currentUser, setUser] = useState<User>();
  const [likeIcon, setLikeIcon] = useState(
    <i id="thumbs-up" className="bi bi-hand-thumbs-up"></i>
  );
  const [flagIcon, setFlagIcon] = useState(<i className="bi bi-flag"></i>);
  const [dislikeIcon, setDisLikeIcon] = useState(
    <i id="thumbs-down" className="bi bi-hand-thumbs-down"></i>
  );
  const [isHidden, setIsHidden] = useState(true);
  const [editHidden, setEditHidden] = useState(true);
  const [editCommentBox, setEditCommentBox] = useState(true);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const cookies = useCookies();
  const token = cookies.get("token");
  const isAuthenticated = Boolean(token);
  const router = useRouter();
  const tags = [];
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    getPost();
    getAllComment();
    getProfileInfo();
  }, []);
  const handleInputChange = (event: any) => {
    setComment(event.target.value);
  };
  async function getPost() {
    try {
      const response = await axios.get(
        `/api/posts/get-post?postId=${params.postId}`
      );
      setData(response.data.post);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  async function getAllComment() {
    try {
      //change to based on postId
      const response = await axios.get(
        `/api/comments/get-comments-given-post-id?postId=${params.postId}`
      );
      setAllComments(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  async function getProfileInfo() {
    try {
      const response = await axios.get(`/api/users/get-profile-info`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content");
    const postId = params.postId;
    try {
      setLoading(true);
      const response = await axios.post("/api/comments/create-comment", {
        content,
        postId,
      });
      console.log("New comment has been created!", response.data);
      toast.success("New post has been created");
      setTimeout(() => {}, 1000);
    } catch (error: any) {
      console.log("Post creation failed", error.response.data);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
    getAllComment();
  }

  async function like() {
    try {
      if (isAuthenticated) {
        if (likeIcon.props.className === "bi bi-hand-thumbs-up") {
          if (dislikeIcon.props.className === "bi bi-hand-thumbs-down") {
            setLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-up-fill"></i>
            );
            //add like
            await axios.get(
              `/api/posts/edit-like?postId=${params.postId}&numLikes=${
                data.numLikes + 1
              }`
            );
          } else {
            //add like but subtract dislike

            setDisLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-down"></i>
            );
            setLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-up-fill"></i>
            );
            await axios.get(
              `/api/posts/edit-like?postId=${params.postId}&numLikes=${
                data.numLikes + 1
              }`
            );
            await axios.get(
              `/api/posts/edit-dislike?postId=${params.postId}&numDislikes=${
                data.numDislikes - 1
              }`
            );
          }
        } else {
          //subtract like
          setLikeIcon(<i id="thumbs-up" className="bi bi-hand-thumbs-up"></i>);
          await axios.get(
            `/api/posts/edit-like?postId=${params.postId}&numLikes=${
              data.numLikes - 1
            }`
          );
        }
      } else {
        toast.error("Log In first");
      }
      getPost();
    } catch (error) {
    } finally {
    }
  }

  async function dislike() {
    try {
      if (isAuthenticated) {
        if (dislikeIcon.props.className === "bi bi-hand-thumbs-down") {
          if (likeIcon.props.className === "bi bi-hand-thumbs-up") {
            //add dislike
            setDisLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-down-fill"></i>
            );
            await axios.get(
              `/api/posts/edit-dislike?postId=${params.postId}&numDislikes=${
                data.numDislikes + 1
              }`
            );
          } else {
            //add dislike but subtract like
            setDisLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-down-fill"></i>
            );
            setLikeIcon(
              <i id="thumbs-up" className="bi bi-hand-thumbs-up"></i>
            );
            await axios.get(
              `/api/posts/edit-like?postId=${params.postId}&numLikes=${
                data.numLikes - 1
              }`
            );
            await axios.get(
              `/api/posts/edit-dislike?postId=${params.postId}&numDislikes=${
                data.numDislikes + 1
              }`
            );
          }
        } else {
          //subtract like
          setDisLikeIcon(
            <i id="thumbs-up" className="bi bi-hand-thumbs-down"></i>
          );
          await axios.get(
            `/api/posts/edit-dislike?postId=${params.postId}&numDislikes=${
              data.numDislikes - 1
            }`
          );
        }
      } else {
        toast.error("Log in First");
      }
      getPost();
    } catch (error) {
    } finally {
    }
  }

  function showComment() {
    setIsHidden(!isHidden);
  }
  async function deletePost() {
    try {
      await axios.get(`/api/posts/delete-post?postId=${params.postId}`);
      console.log("post Deleted");
      toast.success("New post has been created");
      await axios.get(
        `/api/comments/delete-comment-by-post-id?postId=${params.postId}`
      );
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
    } finally {
    }
  }

  async function deleteComment(content: string, postId: string) {
    try {
      await axios.get(
        `/api/comments/delete-comment-by-post-id-and-content?postId=${postId}&content=${content}`
      );
      getAllComment();
    } catch (error) {
    } finally {
    }
  }
  async function editComment(content: string) {
    try {
      await axios.get(
        `/api/comments/edit-comment-by-post-id-and-content?postId=${params.postId}&prevcontent=${content}&content=${comment}`
      );
      getAllComment();
      setEditCommentBox(true);
    } catch (error) {
    } finally {
    }
  }

  async function report() {
    try {
      await axios.get(`/api/posts/report-by-post-id?postId=${params.postId}`);
      if (flagIcon.props.className == "bi bi-flag") {
        setFlagIcon(<i className="bi bi-flag-fill"></i>);
      } else {
        setFlagIcon(<i className="bi bi-flag"></i>);
      }
      console.log("it works");
    } catch (error) {
    } finally {
    }
  }
  function showEditBox() {
    setEditHidden(!editHidden);
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const body = formData.get("body");
    try {
      await axios.get(
        `/api/posts/edit-post?postId=${params.postId}&title=${title}&body=${body}`
      );
      console.log("post edited");
      toast.success("Post has been edited");
    } catch (error) {
    } finally {
    }
    getPost();
  }
  for (let i = 0; i < data.tags.length; i++) {
    tags.push(
      <div className="each-tag" key={i}>
        {data.tags[i]}
      </div>
    );
  }

  function imageExists(image: string) {
    return image != "" ? true : false;
  }

  function getUTC(date: string) {
    return new Date(date).toUTCString();
  }

  return (
    <div className="view-body">
      <div className="posts-container view-post-container">
        <div className="content">
          <div className="post-edit">
            <a href={`/view-profile/${data.user}`} className="post-account">
              {data.username}
            </a>

            <div id="separate-date-and-buttons">
              <div>
                {currentUser?.username === data.username ? (
                  <>
                    <small> {data.isEdited ? "edited" : <></>}</small>
                    <span onClick={report}>{flagIcon}</span>
                    <i className="bi bi-pencil" onClick={showEditBox}></i>
                    <i className="bi bi-trash" onClick={deletePost}></i>
                  </>
                ) : (
                  <>
                    <span onClick={report}>{flagIcon}</span>
                    <small> {data.isEdited ? "edited" : <></>} </small>
                  </>
                )}
              </div>
              <div id="date">{getUTC(data.updatedAt)}</div>
            </div>
          </div>
          {isAuthenticated ? (
            <>
              {editHidden ? (
                <>
                  <div className="h1-title">{data.title}</div>
                  <div className="tags">{tags}</div>
                  {imageExists(data.image) && (
                    <img
                      src={data.image}
                      alt={data.image}
                      className="postImageOnHomepage"
                    />
                  )}
                  <div className="p-body">{data.body}</div>
                </>
              ) : (
                <>
                  <form action="" onSubmit={submitEdit}>
                    <div className="edit-area">
                      <div>
                        <label htmlFor="title-box" className="labels">
                          Title:
                        </label>
                        <input
                          type="text"
                          className="edit-input"
                          defaultValue={data.title}
                          name="title"
                          id="title-box"
                        />
                      </div>
                      {data.image && (
                        <img
                          src={data.image}
                          alt=""
                          width={100}
                          style={{ margin: "auto", display: "block" }}
                        />
                      )}
                      <div>
                        <label htmlFor="body-box" className="labels">
                          Body:
                        </label>
                        <input
                          type="text"
                          className="edit-input"
                          defaultValue={data.body}
                          name="body"
                          id="body-box"
                        />
                        <button className="edit-submit" type="submit">
                          <i className="bi bi-send-arrow-down-fill"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              <h1 className="h1-title">{data.title}</h1>
              <p>{data.body}</p>
            </>
          )}
        </div>
        <div className="options">
          <button className="like" onClick={like}>
            <a>
              <span className="like-change">{likeIcon}</span>
              <span className="like-amount">{data.numLikes}</span>
            </a>
          </button>
          <button className="dislike" onClick={dislike}>
            <a>
              <span className="dislike-change">{dislikeIcon}</span>
              <span className="dislike-amount">{data.numDislikes}</span>
            </a>
          </button>
          <button className="comment" onClick={showComment}>
            <a>
              <i className="bi bi-chat-dots"></i> Comments
            </a>
          </button>
        </div>
        {isAuthenticated ? (
          <>
            <form onSubmit={submitComment}>
              <div className="new-comment-area" id="comment-area">
                <input
                  type="text"
                  className="new-comment"
                  placeholder="Write a comment..."
                  name="content"
                  id="comment-box"
                />
                <button className="comment-submit" type="submit">
                  <i className="bi bi-send-arrow-down-fill"></i>
                </button>
              </div>
            </form>
          </>
        ) : (
          <></>
        )}
        {isHidden ? (
          <></>
        ) : (
          <div className="comments" id="comment-list">
            {allComment.map((comment) => (
              <div
                className="comment-line"
                key={comment._id}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <p className="user-comment">{comment.username}</p>
                <p className="comment-content">{comment.content}</p>
                {isHovered && currentUser?.username == comment.username && (
                  <div className="edit-delete-comments">
                    <div
                      className="icon"
                      onClick={() => {
                        setEditCommentBox(false);
                      }}
                    >
                      {editCommentBox ? (
                        <>
                          <i className="bi bi-pencil-square"></i>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className=""
                            defaultValue={comment.content}
                            name="comment"
                            id="new-comment"
                            onChange={handleInputChange}
                          />
                          <button
                            className="edit-submit"
                            onClick={() => {
                              editComment(comment.content);
                            }}
                          >
                            <i className="bi bi-send-arrow-down-fill"></i>
                          </button>
                        </>
                      )}
                    </div>
                    <div
                      className="icon"
                      onClick={() => {
                        deleteComment(comment.content, comment.postId);
                      }}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </div>
                  </div>
                )}
                {comment.isEdited ? (
                  <span className="edited-comment">Edited</span>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

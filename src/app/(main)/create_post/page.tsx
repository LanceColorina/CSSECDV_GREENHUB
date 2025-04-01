"use client";
import "../../../../styles/create_post.css";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import { UploadButton } from "@/utils/uploadthing";
import Select from "react-select";
import "@uploadthing/react/styles.css";

function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageResponse, setImageResponse] = useState<any>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const body = formData.get("body");
    const tags = formData.getAll("tags");

    try {
      setLoading(true);

      let image = " ";
      if (imageResponse != null) {
        image = imageResponse[0].url;
      }
      const response = await axios.post("/api/posts/create-post", {
        title,
        body,
        tags,
        image,
      });
      console.log("New post has been created!", response.data);
      toast.success("New post has been created");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.log("Post creation failed", error.response.data);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  const options = [
    { value: "Study", label: "Study" },
    { value: "Food", label: "Food" },
    { value: "Hangout", label: "Hangout" },
    { value: "Music", label: "Music" },
    { value: "Rant", label: "Rant" },
    { value: "Game", label: "Game" },
  ];

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="container-for-post">
        <h1>Create Post</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              id="username"
              placeholder="Enter title"
              type="text"
              name="title"
              disabled={loading}
              required
            />
          </div>
          <div className="field">
            <textarea
              id="paragraph"
              placeholder="Enter body here..."
              rows={3}
              cols={50}
              name="body"
              disabled={loading}
              required
            ></textarea>
          </div>
          <Select
            isMulti
            placeholder="Select tags"
            options={options}
            className="tagsSelection"
            name="tags"
          />
          <br />
          <UploadButton
            appearance={{
              button: {
                background: "#dcfce7",
                width: "100%",
                color: "#16A349",
                borderRadius: "2px",
                fontSize: "14px",
              },
            }}
            content={{
              button: "Select image",
              allowedContent:
                "Max file size (4MB). Preferable size ratio (4:5)",
            }}
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageResponse(res);
              alert("Upload complete: " + res[0].url);
            }}
          />
          <br />
          <button disabled={loading} type="submit" className="button">
            Create Post
          </button>
        </form>
      </div>
    </>
  );
}

export default CreatePost;

"use client";
import "../../../../styles/create_post.css";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import { UploadButton } from "@/utils/uploadthing";
import Select from "react-select";
import "@uploadthing/react/styles.css";

// Define type for errors object
type FormErrors = {
  title: string;
  body: string;
};

function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageResponse, setImageResponse] = useState<any>(null);
  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    body: ""
  });

  // Check user role on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("/api/users/get-profile-info");
        const user = response.data.user;

        if (user.role == "viewer") {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  const validateField = (name: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.length < 5) {
          newErrors.title = 'Title must be at least 5 characters long';
        } else if (value.length > 200) {
          newErrors.title = 'Title cannot exceed 200 characters';
        } else {
          newErrors.title = '';
        }
        break;
      
      case 'body':
        if (!value.trim()) {
          newErrors.body = 'Post content is required';
        } else if (value.length < 10) {
          newErrors.body = 'Post content must be at least 10 characters long';
        } else if (value.length > 10000) {
          newErrors.body = 'Post content cannot exceed 10,000 characters';
        } else {
          newErrors.body = '';
        }
        break;
    }

    setErrors(newErrors);
    return newErrors[name] === '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormErrors, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof FormErrors]) {
      validateField(name as keyof FormErrors, value);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const tags = formData.getAll("tags");

    // Validate fields before submission
    const isTitleValid = validateField('title', title);
    const isBodyValid = validateField('body', body);

    if (!isTitleValid || !isBodyValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

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
              id="title"
              placeholder="Enter title (5-200 characters)"
              type="text"
              name="title"
              disabled={loading}
              required
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          <div className="field">
          <textarea
            id="body"
            placeholder="Enter body here... (10-10,000 characters)"
            rows={3}
            cols={50}
            name="body"
            disabled={loading}
            required
            onBlur={handleBlur}
            onChange={handleChange}
            style={{
              resize: 'vertical', // Only allow vertical resizing
              width: '100%',     // Take full width of container
              maxWidth: '100%',  // Ensure it doesn't overflow
              overflowX: 'hidden', // Disable horizontal scrolling
              whiteSpace: 'pre-wrap', // Maintain word wrapping
            }}
          ></textarea>
          {errors.body && <span className="error-message">{errors.body}</span>}
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
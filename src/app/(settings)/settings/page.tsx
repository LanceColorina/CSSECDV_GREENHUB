"use client";
import "../../../../styles/settings.css";
import Image from "next/image";
import franz from "../../../../public/franz.jpeg";
import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { UploadButton } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css";

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  image: string;
}

export default function Settings() {
  const [currentUser, setUser] = useState<User>();
  const [editHidden, setEditHidden] = useState(true);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get("/api/users/get-profile-info");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const editUsername = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const username = formData.get("username");
      const prevName = currentUser?.username;
      await axios.get(`/api/users/edit-username?newName=${username}`);
      await axios.get(
        `/api/posts/edit-post-creator-by-username?newName=${username}&prevName=${prevName}`
      );
      console.log("edited");
      getUser();
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const editBio = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const Bio = formData.get("bio");
      await axios.get(`/api/users/edit-bio?bio=${Bio}`);
      console.log("edited");
      getUser();
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  function showEditBox() {
    setEditHidden(!editHidden);
  }

  async function editProfilePicture(newImage: String) {
    try {
      const res = await axios.put(
        `/api/users/edit-prof-pic/${currentUser?._id}`,
        { newImage }
      );
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div id="myProfileContent" className="my-profile-content">
        <div className="my-profile-wrapper">
          <div>
            <h1>My Profile</h1>
            {/* <i className="bi bi-pencil-square"></i> */}
          </div>
          <br />

          <div>
            <div>
              <div>
                <small>Profile Picture *</small>
                <img src={currentUser?.image} alt="" />
                <UploadButton
                  appearance={{
                    button: {
                      background: "#16A349",
                      width: "50%",
                      color: "white",
                      borderRadius: "5px",
                      fontSize: "14px",
                    },
                  }}
                  content={{
                    button: "Change Photo",
                    allowedContent:
                      "Max file size (4MB). Preferable size ratio (1:1)",
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    editProfilePicture(res[0].url);
                  }}
                />
              </div>
              <br />
              <div>
                <div>
                  <small>Bio ✨</small>
                  <a onClick={showEditBox}>Edit</a>
                </div>
                {editHidden ? (
                  <h3>{currentUser?.bio}</h3>
                ) : (
                  <form
                    className="edit-username-form"
                    action=""
                    onSubmit={editBio}
                  >
                    <div>
                      <input
                        id="username"
                        placeholder={currentUser?.bio}
                        defaultValue={currentUser?.bio}
                        type="text"
                        name="bio"
                        className="bio-input"
                        required
                      />
                      <button className="bio-button" type="submit">
                        <i className="bi bi-send-arrow-down-fill"></i>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div>
              <form
                className="edit-username-form"
                action=""
                onSubmit={editUsername}
              >
                <label htmlFor="username">Username *</label>
                <div>
                  <input
                    id="username"
                    placeholder={currentUser?.username}
                    defaultValue={currentUser?.username}
                    type="text"
                    name="username"
                    required
                  />
                  <button className="btn-primary" type="submit">
                    Edit
                  </button>
                </div>
              </form>
              <br />

              <div>
                <small>First Name</small>
                <h3>{currentUser?.firstName}</h3>
              </div>
              <br />

              <div>
                <small>Last Name</small>
                <h3>{currentUser?.lastName}</h3>
              </div>
              <br />

              <div>
                <small>Email</small>
                <h3>{currentUser?.email}</h3>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

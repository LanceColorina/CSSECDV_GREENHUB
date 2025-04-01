"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  firstName: String;
  lastName: String;
  username: String;
  email: String;
  password: String;
  bio: String;
}

export default function ManagePosts() {
  const [allUsers, setAllUsers] = useState<User[]>();

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/users/get-all-users");
      setAllUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Manage Posts</h2>
        <a href="/admin">Go back</a>

        <table id="postTable">
          <thead>
            <tr>
              <th>user ID</th>
              <th>firstName</th>
              <th>lastName</th>
              <th>username</th>
              <th>email</th>
              <th>password</th>
              <th>bio</th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.bio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

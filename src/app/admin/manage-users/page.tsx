"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  role: string;
}

export default function ManagePosts() {
  const [allUsers, setAllUsers] = useState<User[]>([]);

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

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete("/api/users/delete-user", {
        params: { id: userId },
      });
      getAllUsers(); // refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const editUser = (userId: string) => {
    window.location.href = `/api/edit-user/${userId}`;
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put("/api/users/edit-role", {
        id: userId,
        role: newRole,
      });
      getAllUsers(); // refresh after update
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="container">
      <h2>Manage Users</h2>
      <a href="/admin">Go back</a>

      <table id="postTable">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Bio</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.bio}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => editUser(user._id)}>Edit</button>
                <button
                  onClick={() => deleteUser(user._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


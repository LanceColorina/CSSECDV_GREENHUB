"use client";
import "../../../styles/admin.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State to manage loading status

  const getUser  = async () => {
    try {
      const response = await axios.get("/api/users/get-profile-info");
      // Check if the user role is admin
      if (response.data.user.role !== "admin") {
        router.push("/"); // Redirect to home if not admin
      }
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching user details:", error);
      router.push("/"); // Redirect to home on error
    }
  };

  useEffect(() => {
    getUser ();
  }, [router]); // Add router as a dependency

  // Show loading state while fetching user info
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Admin Dashboard</h2>
      <a href="/admin/manage-posts" className="btn btn-primary">
        Manage Posts
      </a>
      <span> </span>
      <a href="/admin/manage-users" className="btn btn-primary">
        Manage Users
      </a>
      <span> </span>
      <button className="btn btn-secondary" onClick={() => router.push("/")}>
        Return to Home
      </button>
    </>
  );
}
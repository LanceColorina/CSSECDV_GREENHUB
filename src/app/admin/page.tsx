"use client";
import "../../../styles/admin.css";
import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
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
    </>
  );
}

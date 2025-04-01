"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.jpg";
import { useCookies } from "next-client-cookies";
import axios from "axios";
import { useState, useEffect} from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const cookies = useCookies();
  const token = cookies.get("token");
  const isAuthenticated = Boolean(token);
  const [data, setData] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getUserDetails();
    }
  }, [isAuthenticated]);

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/get-user");
      setData(response.data.data.username);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            className="logo"
            width={150}
            height={100}
          />
        </Link>
        <div className="nav-links">
          <Link href="/about" className="btn-tertiary">
            About
          </Link>
          <Link href="/developers" className="btn-tertiary">
            Developers
          </Link>
        </div>
      </div>
      {isAuthenticated ? (
        <>
          <div className="navlinks-authenticated">
            <a href="/settings" className="user-profile-link">
              <div>
                <h5>{data}</h5>
                <small>User</small>
              </div>
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="registration-links">
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign up
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;

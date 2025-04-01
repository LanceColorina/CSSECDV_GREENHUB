"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Link onClick={logout} href="">
        <li>
          <i className="bi bi-box-arrow-right"></i> Logout
        </li>
      </Link>
    </>
  );
}

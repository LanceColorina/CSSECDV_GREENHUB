import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../../styles/settings.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";
import Logout from "@/components/Logout";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <div className="container">
          <div className="options">
            <ul>
              <Link href="/settings" id="myProfileBtn">
                <li className="active">
                  <i className="bi bi-person-fill"></i> My Profile
                </li>
              </Link>
              <Link href="/settings/my-posts" id="myPostsBtn">
                <li>
                  <i className="bi bi-list-ul"></i> My Posts
                </li>
              </Link>
              <Link href="/settings/my-comments" id="myCommentsBtn">
                <li>
                  <i className="bi bi-chat-dots-fill"></i> My Comments
                </li>
              </Link>
              {/* <a href="#"><li><i className="bi bi-eye-fill"></i> Public View</li></a> */}
              <a href="/">
                <li>
                  <i className="bi bi-house-door-fill"></i> Go home
                </li>
              </a>
            </ul>
            <ul>
              <Logout />
            </ul>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

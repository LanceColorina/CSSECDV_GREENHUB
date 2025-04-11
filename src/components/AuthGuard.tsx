"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // or however you manage auth

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: pass allowed roles
};

const AuthGuard = ({ children, allowedRoles }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // still checking session

    if (!session) {
      router.push("/login"); // redirect to login if not authenticated
    } else if (
      allowedRoles &&
      !allowedRoles.includes(session.user.role) // if role check fails
    ) {
      router.push("/"); // main page
    }
  }, [session, status, allowedRoles, router]);

  if (status === "loading" || !session) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default AuthGuard;
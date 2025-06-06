// src/app/page.js

"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../components/Auth/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseclient";


export default function HomePage() {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  // If still checking auth, show a quick placeholder
  if (loading) {
    return <div>Loading user…</div>;
  }

  // If not signed in, redirect to /login
  if (!user) {
    router.replace("/login");
    return null;
  }

  // Handler for logging out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.email}</h1>
      <button
        onClick={handleSignOut}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#e53e3e",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

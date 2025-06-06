// src/components/Auth/PrivateRoute.jsx

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext } from "./UserContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
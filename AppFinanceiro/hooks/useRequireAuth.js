import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  return { loading, isAuthenticated };
}

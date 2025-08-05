"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import SocialMediaPage from "@/components/social-media-page";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/blog");
    } else {
      // sendMessageToApp({ action: "login_required" });
      setCheckedAuth(true);
    }
  }, [user, router]);

  if (!checkedAuth) return null;

  return (
    <ProtectedRoute>
      <SocialMediaPage />
    </ProtectedRoute>
  );
}

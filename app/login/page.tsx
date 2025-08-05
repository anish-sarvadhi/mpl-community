/** @format */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      // sendMessageToApp({ action: "login_required" });
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Please Login</h1>
      <p className="text-lg">Redirecting to login screen...</p>
    </div>
  );
};

export default LoginPage;

/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { MotionDiv } from "@/components/ui/motion";
import { useFirstVisit } from "@/lib/use-first-visit";
import { sendMessageToApp } from "@/lib/sendMessage";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const isFirstVisit = useFirstVisit("profilePageAnimated");
  const router = useRouter();

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData) as UserData;
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sendMessageToApp({ action: "back_to_home" });
    // window.location.href = "app://home"
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">
          Your Profile
        </h2>
        <p className="text-muted-foreground">
          View and manage your account details
        </p>
      </MotionDiv>

      {userData ? (
        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/30"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-16 w-16 border border-primary/50">
              <AvatarImage
                src="/user-placeholder.png"
                alt={`${userData.first_name} ${userData.last_name}`}
              />
              <AvatarFallback>
                {userData.first_name[0]}
                {userData.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-foreground">
                {userData.first_name} {userData.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{userData.user_name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {userData.email}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:mt-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-600/20 hover:to-amber-700/20 border-amber-500/30"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </MotionDiv>
      ) : (
        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-muted rounded-xl p-6 text-center border border-muted-foreground/20"
        >
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Not Logged In</h3>
          <p className="text-muted-foreground mb-4">
            Please log in to view your profile.
          </p>
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </MotionDiv>
      )}
    </div>
  );
}

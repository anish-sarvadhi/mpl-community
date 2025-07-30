/** @format */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { decryptData } from "@/enc-dec";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { API_URL } from "../constants/constants";
import { sendMessageToApp } from "@/lib/sendMessage";

const SSOLoginPage = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const encrypted = searchParams.get("data");

    if (!encrypted) {
      sendMessageToApp({ action: "login_required" });
      router.push("/login");
      return;
    }

    let userParams: Record<string, string> = {};
    try {
      const decrypted = decryptData(encrypted);
      const params = new URLSearchParams(decrypted);
      for (const [key, value] of params.entries()) {
        userParams[key] = value;
      }
    } catch (error) {
      console.error("Failed to decrypt SSO payload:", error);
      sendMessageToApp({ action: "login_required" });
      router.push("/login");
      return;
    }

    const {
      user_id,
      first_name,
      last_name,
      user_name,
      email,
      token,
      return_url,
    } = userParams;

    if (
      !user_id ||
      !first_name ||
      !last_name ||
      !user_name ||
      !email ||
      !token
    ) {
      sendMessageToApp({ action: "login_required" });
      router.push("/login");
      return;
    }

    const storedToken = localStorage.getItem("authToken");

    const completeLogin = (finalUser: Partial<typeof userParams>) => {
      const newUserData = {
        id: finalUser.id || user_id,
        first_name: finalUser.first_name || first_name,
        last_name: finalUser.last_name || last_name,
        user_name: finalUser.user_name || user_name,
        email: finalUser.email || email,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(newUserData));
      setUser({ ...newUserData, token });
      router.push("/");
    };

    // const verifyAndLogin = async () => {
    //   try {
    //     console.log("Verifying token with API:", token);

    //     const response = await axios.get(`${API_URL}/auth/verify-token`, {
    //       headers: { Authorization: token },
    //     });

    //     // Ensure user object exists
    //     const apiUser = response?.data?.data?.user || response?.data?.user;

    //     if (!apiUser) {
    //       throw new Error("No user returned from verify-token API");
    //     }

    //     completeLogin({ ...apiUser, token });
    //   } catch (error) {
    //     console.error(
    //       "Token verification failed or malformed response:",
    //       error
    //     );
    //     localStorage.removeItem("authToken");
    //     localStorage.removeItem("userData");
    //     setUser(null);
    //     // sendMessageToApp({ action: "login_required" });
    //     router.push(return_url || "/login");
    //   }
    // };

    const verifyAndLogin = async () => {
      try {
        console.log("Verifying token with API:", token);

        const response = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const apiUser = response?.data?.data?.user || response?.data?.user;

        if (!apiUser) {
          throw new Error("No user returned from verify-token API");
        }

        completeLogin({ ...apiUser, token });
      } catch (error) {
        console.error(
          "Token verification failed or malformed response:",
          error
        );
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setUser(null);

        // Platform-specific safe message handling
        try {
          // sendMessageToApp({ action: "login_required" });
        } catch (e) {
          console.warn("sendMessageToApp failed:", e);
        }
      }
    };

    verifyAndLogin();
  }, [searchParams, setUser, router]);

  return <div />;
};

export default SSOLoginPage;

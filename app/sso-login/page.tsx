/** @format */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { decryptData } from "@/enc-dec";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { API_URL } from "../constants/constants";

const SSOLoginPage = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const encrypted = searchParams.get("data");

    if (!encrypted) {
      window.parent.postMessage({ action: "login_required-2" }, "*");
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
      window.parent.postMessage({ action: "login_required-3" }, "*");
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
      router.push("/login");
      return;
    }

    const storedToken = localStorage.getItem("authToken");

    const completeLogin = (finalUser: typeof userParams) => {
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

    if (storedToken === token) {
      completeLogin(userParams);
    } else {
      axios
        .get(`${API_URL}/auth/verify-token`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          const apiUser = response.data.data?.user || response.data.user || {};
          completeLogin({
            ...apiUser,
            token,
          });
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setUser(null);
          window.parent.postMessage({ action: "login_required-4" }, "*");
          router.push(return_url || "/login");
        });
    }
  }, [searchParams, setUser, router]);

  return <div />;
};

export default SSOLoginPage;

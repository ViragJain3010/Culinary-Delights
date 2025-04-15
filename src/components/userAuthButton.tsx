"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserAuthButton() {
  const { userLoggedin } = useAuth();
  console.log("🚀 ~ UserAuthButton ~ userLoggedin:", userLoggedin);
  const router = useRouter();

  // Handle logout with redirect
  const handleLogout = async () => {
    try {
      // Get tokens needed for logout
      const logoutToken = localStorage.getItem("logout_token");
      const csrfToken = localStorage.getItem("csrf_token");

      if (logoutToken) {
        // Make logout request to Drupal
        await axios.get(
          `https://recipes.ddev.site/user/logout_format=json?token=${logoutToken}`,
          {
            withCredentials: true,
            headers: {
              "X-CSRF-Token": csrfToken || "",
            },
          }
        );
      }

      // Clear all tokens from local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("logout_token");
      localStorage.removeItem("csrf_token");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {!userLoggedin ? (
        <Link href="/login">
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </Link>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      )}
    </>
  );
}

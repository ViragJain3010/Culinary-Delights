"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUserLoggedin } = useAuth();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle code after redirect
  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const formData = new URLSearchParams();
      formData.append("grant_type", "authorization_code");
      formData.append("client_id", process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID);
      formData.append(
        "client_secret",
        process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET
      );
      formData.append("redirect_uri", "http://localhost:3000/login");
      formData.append("code", code);

      axios
        .post("https://recipes.ddev.site/oauth/token", formData.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          const { access_token, refresh_token, expires_in } = res.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("expires_in", expires_in);
          console.log("Login success. Redirecting...", res.data);
          router.push("/");
        })
        .catch((err) => {
          console.error("Token exchange failed", err);
          setError("Authorization failed");
        });
    }
  }, [searchParams, router]);

  // Step 1-3: Login and redirect to auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Login with username/password
      const res = await axios.post(
        "https://recipes.ddev.site/user/login?_format=json",
        {
          name: username,
          pass: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);

      // 2. Save logout_token and csrf_token
      localStorage.setItem("logout_token", res.data.logout_token);
      localStorage.setItem("csrf_token", res.data.csrf_token);

      // 3. Make GET request to OAuth authorize endpoint
      // 3. Redirect to OAuth authorize endpoint using browser (preserves cookies)

      window.location.href =
        `https://recipes.ddev.site/oauth/authorize?` +
        new URLSearchParams({
          response_type: "code",
          client_id: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID,
          redirect_uri: "http://localhost:3000/login",
          scope: "oauth_scope",
          state: "state_id",
        }).toString();
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}

      {/* Form Login */}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
        >
          'Login'
        </button>
      </form>
    </div>
  );
}

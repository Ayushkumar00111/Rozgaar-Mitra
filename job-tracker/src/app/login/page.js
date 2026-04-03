"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token || data.user.role === "admin") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] border border-gray-100">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to your job seeker account
        </p>

        <input
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>

      </div>

    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.user) {
      alert("Signup successful");
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[400px] border border-gray-100">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Join and find your dream job
        </p>

        <input
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-lg"
        >
          Signup
        </button>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}
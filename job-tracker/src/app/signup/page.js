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
    <div className="p-5">
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2 m-2" />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 m-2" />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="border p-2 m-2" />

      <button onClick={handleSignup} className="bg-green-500 text-white p-2">
        Signup
      </button>
    </div>
  );
}
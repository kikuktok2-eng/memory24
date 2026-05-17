"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = () => {
    if (user === "admin" && pass === "123456") {
      localStorage.setItem("auth", "admin");
      router.push("/");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-white">

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 w-80">

        <h1 className="mb-4">Admin Login</h1>

        <input
          placeholder="Username"
          className="w-full p-2 mb-2 bg-black/30 border border-white/10 rounded"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black/30 border border-white/10 rounded"
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-pink-500 py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}
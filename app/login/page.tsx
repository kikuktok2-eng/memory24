"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = () => {
    // 🔐 Mengambil data rahasia dari Environment Variables Vercel
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

    if (user === adminUser && pass === adminPass) {
      localStorage.setItem("auth", "admin");
      router.push("/");
    } else {
      alert("Login gagal! Periksa kembali username dan password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-white">

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 w-80">

        <h1 className="mb-4 font-semibold text-lg text-center">Admin Login ✏️</h1>

        <input
          placeholder="Username"
          className="w-full p-2 mb-2 bg-black/30 border border-white/10 rounded focus:outline-none focus:border-pink-500 text-sm transition-all"
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black/30 border border-white/10 rounded focus:outline-none focus:border-pink-500 text-sm transition-all"
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()} // Membantu user agar bisa login hanya dengan tekan Enter
        />

        <button
          onClick={login}
          className="w-full bg-pink-500 hover:bg-pink-600 font-medium py-2 rounded transition-all text-sm shadow-lg shadow-pink-500/10"
        >
          Login
        </button>

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // State untuk form input data baru
  const [statusText, setStatusText] = useState("In a Quiet Love Story");
  const [statusDate, setStatusDate] = useState("Since 2024");
  const [newMusic, setNewMusic] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoDesc, setNewPhotoDesc] = useState("");

  // Pelindung Halaman: Cek status auth di localStorage saat halaman dimuat
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "admin") {
      // Jika belum login, tendang balik ke halaman login
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#05070c] flex items-center justify-center text-white/50 text-sm tracking-widest">
        CHECKING CREDENTIALS...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070c] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Aesthetic Glow */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500/5 blur-[150px] -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -bottom-40 -left-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Memory Space Control Center</h1>
            <p className="text-xs text-white/40 mt-1">Manage your visual archives, tracks, and moments.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium transition-all"
            >
              View Live Site 🌐
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all"
            >
              Logout 🔒
            </button>
          </div>
        </div>

        {/* GRID KONTROL PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. KELOLA JALUR FOTO (GALLERY) */}
          <motion.div whileHover={{ y: -2 }} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm border-b border-white/5 pb-2">
              <span>📸</span> Add New Photo Memory
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Photo Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-pink-500 transition-all text-white/80"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Memory Caption / Description</label>
                <input 
                  type="text" 
                  placeholder="e.g., Night coffee shop deep talks" 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-pink-500 transition-all text-white/80"
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { alert("Photo added! (This is a mock action, connect to storage later)"); }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-pink-500/10"
              >
                Upload Photo to Grid
              </button>
            </div>
          </motion.div>

          {/* 2. KELOLA SOUNDTRACK MUSIK */}
          <motion.div whileHover={{ y: -2 }} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm border-b border-white/5 pb-2">
              <span>🎵</span> Add Track Playlist
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Track Name & Artist</label>
                <input 
                  type="text" 
                  placeholder="e.g., Lover - Taylor Swift" 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-all text-white/80"
                  value={newMusic}
                  onChange={(e) => setNewMusic(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { alert("Track saved!"); }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/10"
              >
                Append New Track
              </button>
            </div>
          </motion.div>

          {/* 3. KELOLA HUBUNGAN & STATUS (RELATIONSHIP STATUS) */}
          <motion.div whileHover={{ y: -2 }} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm border-b border-white/5 pb-2">
              <span>❤️</span> Relationship Status Update
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Status Phrase</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all text-white/80"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Anniversary Tracker Teks</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all text-white/80"
                  value={statusDate}
                  onChange={(e) => setStatusDate(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { alert("Status updated successfully!"); }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10"
              >
                Save Status Info
              </button>
            </div>
          </motion.div>

          {/* 4. KELOLA TEMPAT YANG DIKUNJUNGI */}
          <motion.div whileHover={{ y: -2 }} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm border-b border-white/5 pb-2">
              <span>📍</span> Append Places Visited
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/40 block mb-1">Location Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Sunset Beach" 
                  className="w-full p-2.5 bg-black/30 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-white/80"
                  value={newPlace}
                  onChange={(e) => setNewPlace(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { alert("Location pinned!"); }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-xs font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
              >
                Pin New Location
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </main>
  );
}
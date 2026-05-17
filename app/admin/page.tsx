"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();

  // State Manajemen Konten Dinamis
  const [activeTab, setActiveTab] = useState("photos");
  const [statusText, setStatusText] = useState("In a Quiet Love Story");
  const [statusDate, setStatusDate] = useState("Since 2024");
  
  // State Input Form
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [placeName, setPlaceName] = useState("");

  return (
    <main className="min-h-screen bg-[#030508] text-white relative overflow-hidden font-sans antialiased">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-500/10 to-transparent blur-[140px] -top-80 -left-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/10 to-transparent blur-[140px] -bottom-80 -right-60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-10 relative z-10">
        
        {/* TOP GLOWING BAR & HEADER */}
        <div className="rounded-3xl p-6 bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] tracking-[0.3em] font-bold text-white/40 uppercase">Instant Live Customizer</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-1 bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
              Creative Studio.
            </h1>
          </div>
          
          <button 
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-xs transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 active:scale-95"
          >
            <span>✨ Back to Space</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* INTERACTIVE CONTROLS CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: UNIFIED NAVIGATION TABS */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 font-bold mb-3">Navigation</p>
            {[
              { id: "photos", label: "Visual Archive", icon: "📸", color: "hover:text-pink-400" },
              { id: "music", label: "Soundtrack", icon: "🎵", color: "hover:text-purple-400" },
              { id: "status", label: "Timeline Status", icon: "❤️", color: "hover:text-blue-400" },
              { id: "places", label: "Pinned Places", icon: "📍", color: "hover:text-emerald-400" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                  activeTab === tab.id
                    ? "bg-white/5 border-white/20 text-white shadow-xl shadow-black/40 pl-6"
                    : "bg-transparent border-transparent text-white/40 " + tab.color
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div layoutId="dot" className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                )}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE: GLASSMORPHIC EDIT PANEL */}
          <div className="lg:col-span-8">
            <div className="min-h-[400px] rounded-3xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-xl p-6 md:p-8 relative">
              <AnimatePresence mode="wait">
                
                {/* FORM EDIT FOTO */}
                {activeTab === "photos" && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-base font-bold text-pink-400">Add Image Memory</h3>
                      <p className="text-xs text-white/40">Inject images to your curated memory cluster.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Secure Image Address (URL)</label>
                        <input 
                          type="text"
                          placeholder="https://images.unsplash.com/your-image-id..."
                          className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-pink-500 transition-all text-white/80 font-mono"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Story Caption</label>
                        <input 
                          type="text"
                          placeholder="Describe this exact frame..."
                          className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-pink-500 transition-all text-white/80"
                          value={photoDesc}
                          onChange={(e) => setPhotoDesc(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => alert("Photo mapped to grid!")}
                        className="w-full bg-pink-500 hover:bg-pink-600 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-[0.99]"
                      >
                        Push Image to Live Grid
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FORM EDIT MUSIK */}
                {activeTab === "music" && (
                  <motion.div
                    key="music"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-base font-bold text-purple-400">Append Soundtrack</h3>
                      <p className="text-xs text-white/40">Queue a new favorite song to the interface.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Track Title</label>
                          <input 
                            type="text"
                            placeholder="e.g., Lover"
                            className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-all text-white/80"
                            value={musicTitle}
                            onChange={(e) => setMusicTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Artist name</label>
                          <input 
                            type="text"
                            placeholder="e.g., Taylor Swift"
                            className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-all text-white/80"
                            value={musicArtist}
                            onChange={(e) => setMusicArtist(e.target.value)}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => alert("Track attached!")}
                        className="w-full bg-purple-500 hover:bg-purple-600 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-[0.99]"
                      >
                        Insert Track Into Space
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FORM EDIT TIMELINE STATUS */}
                {activeTab === "status" && (
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-base font-bold text-blue-400">Timeline / Anniversary Info</h3>
                      <p className="text-xs text-white/40">Alter status indicators instantly.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Status Phrase</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all text-white/80"
                          value={statusText}
                          onChange={(e) => setStatusText(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Anniversary Description</label>
                        <input 
                          type="text"
                          className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition-all text-white/80"
                          value={statusDate}
                          onChange={(e) => setStatusDate(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => alert("Relationship variables updated!")}
                        className="w-full bg-blue-500 hover:bg-blue-600 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99]"
                      >
                        Apply Status Update
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FORM EDIT TEMPAT */}
                {activeTab === "places" && (
                  <motion.div
                    key="places"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-base font-bold text-emerald-400">Pin Visited Spots</h3>
                      <p className="text-xs text-white/40">Pin locations you have conquered together.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-semibold">Spot Location Name</label>
                        <input 
                          type="text"
                          placeholder="e.g., Sunset Beach"
                          className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-white/80"
                          value={placeName}
                          onChange={(e) => setPlaceName(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => alert("Spot pinned permanently!")}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
                      >
                        Drop Pin on Coordinates
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
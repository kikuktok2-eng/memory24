"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [myMood, setMyMood] = useState("⚡ Produktif");
  const [partnerMood, setPartnerMood] = useState("☕ Butuh Ngopi");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    // Hitung hari dari 1 Januari 2024
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    return () => clearTimeout(timer);
  }, []);

  // Animasi progress bar musik pas aktif
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTrack !== null) {
      setTrackProgress(0);
      interval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [activeTrack]);

  const moods = ["⚡ Produktif", "☕ Butuh Ngopi", "😴 Ngantuk Berat", "🎮 Butuh Main Game", "🥰 Kangen", "🫠 Capek Tapi Happy"];

  const rotateMood = (current: string, setMood: (m: string) => void) => {
    const currentIndex = moods.indexOf(current);
    const nextIndex = (currentIndex + 1) % moods.length;
    setMood(moods[nextIndex]);
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#05070c] text-slate-200 font-sans selection:bg-pink-500/20 pb-24 relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-pink-500/[0.03] blur-[150px] -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-blue-500/[0.03] blur-[150px] top-1/2 -right-40 pointer-events-none" />

      {/* HERO BANNER */}
      <section className="h-[50vh] flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-pink-400 bg-pink-400/5 px-3 py-1 rounded-full border border-pink-400/10">
            OUR DIGITAL SPACE // v2.1
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Shared Memory.
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto font-normal">
            Tempat nyimpen semua log aktivitas, foto random, playlist kurasi sendiri, dan semua blueprint rencana kita ke depan. 
          </p>
        </motion.div>
      </section>

      {/* SUPER BENTO GRID */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-10">
        
        {/* CARD 1: UTAMA - DAYS TOGETHER (Lebar 2 Kolom) */}
        <Card className="p-6 sm:col-span-2 flex flex-col justify-between bg-gradient-to-br from-slate-900/80 to-transparent min-h-[180px]">
          <div className="flex justify-between items-start">
            <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Days Counter</span>
            <span className="text-slate-500 text-[10px] font-mono">EST. 01/01/2024</span>
          </div>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-6xl font-black tracking-tighter text-white">
              {daysTogether}+
            </span>
            <span className="text-slate-400 text-xs">Hari bareng dan masih bakal terus bertambah.</span>
          </div>
        </Card>

        {/* CARD 2: MOOD TRACKER INTERAKTIF */}
        <Card className="p-5 flex flex-col justify-between">
          <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Vibe Check Hari Ini</span>
          <div className="space-y-2 my-3">
            <div 
              className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05]"
              onClick={() => rotateMood(myMood, setMyMood)}
            >
              <span className="text-[11px] text-slate-400">Aku:</span>
              <span className="text-xs font-medium text-white">{myMood}</span>
            </div>
            <div 
              className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05]"
              onClick={() => rotateMood(partnerMood, setPartnerMood)}
            >
              <span className="text-[11px] text-slate-400">Kamu:</span>
              <span className="text-xs font-medium text-white">{partnerMood}</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 text-center block">Klik buat ganti status mood</span>
        </Card>

        {/* CARD 3: QUICK LINKS / ACCESSIBILITY */}
        <Card className="p-5 flex flex-col justify-between">
          <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Shared Hub</span>
          <div className="grid grid-cols-2 gap-2 my-2">
            <a href="#" className="p-2 bg-slate-900/40 rounded-lg text-center text-xs hover:text-pink-400 border border-white/5 transition-colors">📂 GDrive</a>
            <a href="#" className="p-2 bg-slate-900/40 rounded-lg text-center text-xs hover:text-blue-400 border border-white/5 transition-colors">📝 Notion</a>
            <a href="#" className="p-2 bg-slate-900/40 rounded-lg text-center text-xs hover:text-green-400 border border-white/5 transition-colors">🎵 Spotify</a>
            <a href="#" className="p-2 bg-slate-900/40 rounded-lg text-center text-xs hover:text-amber-400 border border-white/5 transition-colors">📍 Maps</a>
          </div>
          <span className="text-[9px] text-slate-500">Akses cepat semua storage bareng</span>
        </Card>

        {/* CARD 4: BUCKET LIST PROGRESS */}
        <Card className="p-5 md:col-span-2 flex flex-col justify-between">
          <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider">Milestone Checklist</span>
          <div className="space-y-3 my-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Nabung buat liburan akhir tahun</span>
                <span className="text-emerald-400 text-xs font-mono">75%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Khatam hunting kuliner legendaris</span>
                <span className="text-slate-500 text-xs font-mono">40%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[40%] h-full bg-slate-700" />
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 5: WEEKLY TRIVIA / INSIDE JOKES */}
        <Card className="p-5 flex flex-col justify-between">
          <span className="text-amber-400 text-[10px] font-mono uppercase tracking-wider">Inside Jokes Pekan Ini</span>
          <div className="my-2 bg-amber-500/[0.02] border border-amber-500/10 p-2.5 rounded-lg">
            <p className="text-xs text-slate-300 italic">"Gak papa telat jemput, yang penting gak salah bawa motor."</p>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Context: Kejadian hari Selasa lalu</span>
        </Card>

        {/* CARD 6: RANDOM LOCKER / SECRET MESSAGE */}
        <Card 
          className="p-5 flex flex-col justify-between border-slate-800 cursor-pointer hover:bg-white/[0.02]"
          onClick={() => setShowSecret(!showSecret)}
        >
          <div className="flex justify-between items-center">
            <span className="text-red-400 text-[10px] font-mono uppercase tracking-wider">Encrypted Note</span>
            <span className="text-xs">{showSecret ? "🔓" : "🔒"}</span>
          </div>
          <p className="text-xs text-slate-300 my-2 leading-relaxed">
            {showSecret 
              ? "Makasih ya udah selalu chill menghadapi kegabutan dan sifat random aku. Let's make more memories ahead!" 
              : "Ada pesan dikunci. Klik buat unlock."}
          </p>
          <span className="text-[9px] text-slate-500 font-mono">TAP TO DECRYPT</span>
        </Card>

      </section>

      {/* PHOTO ARCHIVE */}
      <Section title="Visual Dump">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", tag: "Random Walk" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", tag: "Coffee Routine" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", tag: "Catching Sunset" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", tag: "Late Night Chat" },
          ].map((photo, i) => (
            <div key={i} className="group cursor-pointer border border-white/5 rounded-xl p-1.5 bg-slate-900/20">
              <div className="aspect-square overflow-hidden rounded-lg bg-slate-950">
                <img 
                  src={photo.url} 
                  alt={photo.tag} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-[11px] font-medium text-slate-200">{photo.tag}</span>
                <span className="text-[9px] font-mono text-slate-500">#0{i+1}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TRACK COVERS */}
      <Section title="On Repeat Right Now">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Lover", artist: "Taylor Swift", len: "03:41" },
            { title: "About You", artist: "The 1975", len: "05:26" },
            { title: "Best Friend", artist: "Rex Orange County", len: "04:21" },
            { title: "Untuk Perempuan Yang Sedang Di Pelukan", artist: "Payung Teduh", len: "05:43" },
          ].map((track, i) => (
            <Card 
              key={i} 
              className={`p-3 flex items-center justify-between group cursor-pointer transition-all ${activeTrack === i ? 'border-pink-500/30 bg-pink-500/[0.02]' : 'bg-slate-900/10'}`}
              onClick={() => setActiveTrack(activeTrack === i ? null : i)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-xs font-mono text-slate-400 flex-shrink-0">
                  {activeTrack === i ? "⏸️" : `0${i+1}`}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-xs text-slate-200 group-hover:text-pink-400 transition-colors truncate">{track.title}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{track.artist}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 font-mono flex-shrink-0">
                <span className="text-[9px] text-slate-500">{track.len}</span>
                <div className="w-16 h-[2px] bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 transition-all duration-300" 
                    style={{ width: activeTrack === i ? `${trackProgress}%` : "15%" }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CHILL NOTES FOOTER */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="w-full bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Situs ini aktif & dipantau berkala buat nyimpen data berdua.</span>
          </div>
          <span className="text-slate-600 text-[10px]">BUILD STATUS: OPTIMIZED</span>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-slate-600 font-mono text-[9px] tracking-[0.25em] pt-16 pb-4">
        MADE WITH MEMORIES & SIMPLICITY — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

/* SECTION WRAPPER */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold whitespace-nowrap">
          {title}
        </h2>
        <div className="w-full h-[1px] bg-slate-900" />
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

/* CARD COMPONENT WITH LIGHT HOVER EFFECT */
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2, border: "1px solid rgba(244, 63, 94, 0.15)" }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        rounded-xl border border-white/[0.05] bg-[#090d16]/30 backdrop-blur-sm
        transition-all duration-200 ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
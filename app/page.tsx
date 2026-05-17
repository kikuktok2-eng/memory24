"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isNoteDecrypted, setIsNoteDecrypted] = useState(false);
  
  // State untuk Fitur Mood Tracker Skena Romantis
  const [myMood, setMyMood] = useState("Vibe: Lagi Kangen Berat");
  const [partnerMood, setPartnerMood] = useState("Vibe: Butuh Deep Talk");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTrack !== null) {
      setTrackProgress(0);
      interval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [activeTrack]);

  const moodList = [
    "Vibe: Lagi Kangen Berat", 
    "Vibe: Butuh Deep Talk", 
    "Vibe: Pengen Ketemu", 
    "Vibe: Salting Brutal", 
    "Vibe: Safe Place Kamu"
  ];

  const rotateMood = (current: string, setMood: (m: string) => void) => {
    const currentIndex = moodList.indexOf(current);
    const nextIndex = (currentIndex + 1) % moodList.length;
    setMood(moodList[nextIndex]);
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#05070c] text-white relative overflow-hidden font-sans selection:bg-pink-500/30 pb-20">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/10 to-transparent blur-[150px] -top-96 -left-96 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-[130px] top-1/2 -right-80 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/5 to-transparent blur-[160px] -bottom-96 left-1/3 pointer-events-none" />

      {/* HERO SECTION - 100VH + SCROLL DOWN */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Our Tiny Universe // Berdua Selamanya
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            Us Against The World.
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">
            Tempat rahasia buat nyimpen semua tawa random kita, jarak yang lagi kita lawan, dan sejuta rencana masa depan yang mau kita wujudin bareng.
          </p>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">Intip Isi Semesta Kita</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* SUPER BENTO GRID MAXIMAL - PERSPECTIVE 1000PX */}
      <Section title="Our Love Language Dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 [perspective:1000px]">
          
          {/* FITUR 1: MAIN COUNTER (Lebar 2 Kolom) */}
          <Card className="p-6 sm:col-span-2 flex flex-col justify-between bg-gradient-to-br from-white/[0.03] to-transparent min-h-[180px]">
            <div className="flex justify-between items-start">
              <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Masa Berlayar Berdua</span>
              <span className="text-white/30 text-[10px] font-mono">SINCE 01/01/2024</span>
            </div>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                {daysTogether} Hari Cinta
              </span>
              <span className="text-white/40 text-xs">Tiap detiknya berharga, ga mau nuker kamu sama apa pun.</span>
            </div>
          </Card>

          {/* FITUR 2: INTERACTIVE MOOD TRACKER TIKTOK STYLE */}
          <Card className="p-5 flex flex-col justify-between min-h-[180px]">
            <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Lagi Mikirin Apa Ya?</span>
            <div className="space-y-2 my-2">
              <div 
                className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors"
                onClick={() => rotateMood(myMood, setMyMood)}
              >
                <span className="text-[11px] text-white/40">Aku:</span>
                <span className="text-xs font-medium text-white">{myMood}</span>
              </div>
              <div 
                className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors"
                onClick={() => rotateMood(partnerMood, setPartnerMood)}
              >
                <span className="text-[11px] text-white/40">Kamu:</span>
                <span className="text-xs font-medium text-white">{partnerMood}</span>
              </div>
            </div>
            <span className="text-[9px] text-white/30 text-center block font-mono">TAP BUAT UPDATE VIBE KAMU</span>
          </Card>

          {/* FITUR 3: SHARED HUB ACCESSIBILITY LINKS */}
          <Card className="p-5 flex flex-col justify-between min-h-[180px]">
            <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Our Safe Place Hub</span>
            <div className="grid grid-cols-2 gap-2 my-2">
              <a href="#" className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-pink-400 border border-white/5 transition-colors font-mono">📂 Foto Kita</a>
              <a href="#" className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-blue-400 border border-white/5 transition-colors font-mono">📝 Wishlist</a>
              <a href="#" className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-green-400 border border-white/5 transition-colors font-mono">🎵 Playlist</a>
              <a href="#" className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-amber-400 border border-white/5 transition-colors font-mono">📍 Rumah</a>
            </div>
            <span className="text-[9px] text-white/30 font-mono">SEMUA MEMORI ADA DI SINI</span>
          </Card>

          {/* FITUR 4: GEOGRAPHIC DATA ANALYZER (LDR METRIC) */}
          <Card className="p-5 flex flex-col justify-between min-h-[160px]">
            <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-wider">Jarak Yang Bakal Kita Kalahin</span>
            <div className="my-2">
              <p className="text-2xl font-black tracking-tight text-white">± 780 Km Antara Kita</p>
              <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                Tenang aja, sejauh apa pun bentangan jaraknya, hati aku domisilinya tetep di kamu kok.
              </p>
            </div>
            <span className="text-[9px] text-cyan-500/50 font-mono">STATUS: KANGEN BRUTAL</span>
          </Card>

          {/* FITUR 5: MILESTONE PROGRESS TRACKER (Lebar 2 Kolom) */}
          <Card className="p-5 sm:col-span-2 flex flex-col justify-between min-h-[160px]">
            <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider">Mimpi-Mimpi Yang Mau Kita Centang</span>
            <div className="space-y-3 my-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/70">Nabung Halal Bareng (Future Funding)</span>
                  <span className="text-emerald-400 font-mono">85%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/70">Satu Atap dan Hidup Bareng (Ending Era)</span>
                  <span className="text-white/30 font-mono">20%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "20%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-white/40" />
                </div>
              </div>
            </div>
          </Card>

          {/* FITUR 6: TRIVIA / LOG INSIDE JOKES CAPSULE */}
          <Card className="p-5 flex flex-col justify-between min-h-[160px]">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-wider">Kejadian Random Yang Bikin Ngakak</span>
            <div className="my-2 bg-amber-500/[0.02] border border-amber-500/10 p-2 rounded-lg">
              <p className="text-[11px] text-white/70 italic font-mono leading-normal">
                "Gak papa telat jemputnya, asal jangan malah bawa motor orang lain ya sayang..."
              </p>
            </div>
            <span className="text-[9px] text-white/30 font-mono">INSIDEN: SELASA KEMARIN</span>
          </Card>

        </div>
      </Section>

      {/* FITUR 7: ARSIP DOKUMENTASI VISUAL */}
      <Section title="Our Visual Dump & Core Memories">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 [perspective:1000px]">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", desc: "Waktu Cari Senja" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", desc: "Date Ngopi Random" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", desc: "Pap Cantik Kamu" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", desc: "Deep Talk Malam Hari" },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", desc: "Liburan Singkat Kita" },
          ].map((photo, i) => (
            <Card key={i} className="overflow-hidden bg-white/5 relative group p-1.5">
              <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
                <img 
                  src={photo.url} 
                  alt={photo.desc} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-[9px] font-mono text-pink-400">MEMORIES_0{i+1}</p>
                  <p className="text-xs text-white truncate">{photo.desc}</p>
                </div>
              </div>
              <div className="p-2 font-mono flex justify-between items-center text-[10px] group-hover:opacity-0 transition-opacity">
                <span className="text-white/40">CUTE_0{i+1}</span>
                <span className="text-white/20 truncate max-w-[70px]">{photo.desc}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FITUR 8: REPOSITORI LATAR SUARA DENGAN ANIMASI EQUALIZER */}
      <Section title="Lagu Yang Menggambarkan Kamu">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [perspective:1000px]">
          {[
            { title: "Lover", artist: "Taylor Swift", duration: "03:41" },
            { title: "About You", artist: "The 1975", duration: "05:26" },
            { title: "Best Friend", artist: "Rex Orange County", duration: "04:21" },
            { title: "Untuk Perempuan Yang Sedang Di Pelukan", artist: "Payung Teduh", duration: "05:43" },
          ].map((track, i) => (
            <Card 
              key={i} 
              className={`p-4 flex items-center justify-between group bg-white/[0.02] hover:border-pink-500/30 cursor-pointer ${activeTrack === i ? 'border-pink-500/40 bg-white/[0.04]' : ''}`}
              onClick={() => setActiveTrack(activeTrack === i ? null : i)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs relative">
                  {activeTrack === i ? (
                    <div className="flex gap-[2px] items-end h-3">
                      <div className="w-[2px] h-3 bg-pink-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-[2px] h-2 bg-pink-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
                      <div className="w-[2px] h-4 bg-pink-500 animate-bounce" style={{ animationDelay: "0.5s" }} />
                    </div>
                  ) : `0${i+1}`}
                </div>
                <div>
                  <h3 className="font-medium text-xs text-white group-hover:text-pink-400 transition-colors">{track.title}</h3>
                  <p className="text-[11px] text-white/40">{track.artist}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5 font-mono">
                <span className="text-[10px] text-white/30">{track.duration}</span>
                <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 transition-all duration-300" 
                    style={{ width: activeTrack === i ? `${trackProgress}%` : "0%" }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* BOTTOM HUB: FITUR 9 (ENCRYPTED NOTE) & FITUR 10 (SYSTEM LOG TERMINAL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-4 px-6 pb-12 [perspective:1000px]">
        
        {/* FITUR 9: CATATAN TERENKRIPSI */}
        <Card 
          className="p-5 bg-white/[0.02] md:col-span-1 cursor-pointer flex flex-col justify-between min-h-[160px]"
          onClick={() => setIsNoteDecrypted(!isNoteDecrypted)}
        >
          <div>
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block mb-2">Pesan Rahasia Buat Kamu</span>
            <p className="text-xs font-light text-white/70 leading-relaxed font-mono">
              {isNoteDecrypted 
                ? "Makasih banyak ya udah selalu sabar, chill, dan jadi safe place paling nyaman buat aku. I love you to the moon and back! ❤️" 
                : "Ada surat cinta dikunci nih. Klik komponen ini buat baca isinya..."}
            </p>
          </div>
          <span className="text-[9px] text-white/30 font-mono mt-3 uppercase">{isNoteDecrypted ? "STATUS: UNLOCKED" : "STATUS: LOCKED"}</span>
        </Card>
        
        {/* FITUR 10: LOG AKTIVITAS TERAKHIR TERMINAL */}
        <Card className="p-5 bg-white/[0.01] md:col-span-2 font-mono text-[11px] text-white/50 flex flex-col justify-between min-h-[160px]">
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-2">Our Love System Status</span>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
              <span className="text-emerald-400">[INFO] LOVE_STREAK</span>
              <span>Hari ke-{daysTogether} bareng kamu dan sayangnya masih nambah terus.</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
              <span className="text-blue-400">[DATA] MEMORY_ADDED</span>
              <span>Berhasil nambah memori manis baru di database hati.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400">[WARN] MISSING_YOU</span>
              <span>Sinyal kangen mendadak naik drastis, butuh peluk secepatnya.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-white/20 text-[10px] tracking-[0.25em] py-12 border-t border-white/[0.02] bg-black/20 font-mono">
        by Kukz — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

/* WIDGET CONTAINER SEKSI */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-6 py-14"
    >
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 font-bold whitespace-nowrap">
          {title}
        </h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

/* TRACKING 3D MOUSE PARALLAX & RADIAL GLOW */
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const xCoord = e.clientX - rect.left - width / 2;
    const yCoord = e.clientY - rect.top - height / 2;

    rotateX.set(-(yCoord / height) * 14); 
    rotateY.set((xCoord / width) * 14);

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const backgroundImage = useMotionTemplate`
    radial-gradient(
      220px circle at ${mouseX}px ${mouseY}px,
      rgba(244, 63, 94, 0.08),
      transparent 80%
    )
  `;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -5, scale: 1.015 }}
      onClick={onClick}
      className={`
        rounded-2xl border border-white/[0.08] bg-[#07090e]/70 backdrop-blur-md
        transition-all duration-150 ease-out select-none relative group ${className}
      `}
    >
      <motion.div 
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-300" 
        style={{ backgroundImage }} 
      />
      <div style={{ transform: "translateZ(25px)" }} className="h-full w-full relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
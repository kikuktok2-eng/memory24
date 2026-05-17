"use client";

import { useEffect, useState } from "react";
import { motion } from " framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isNoteDecrypted, setIsNoteDecrypted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    // Kalkulasi hari sejak tanggal dasar: 1 Januari 2024
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    return () => clearTimeout(timer);
  }, []);

  // Simulasi pemrosesan durasi audio saat status aktif
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

  return (
    <main className="min-h-screen bg-[#05070c] text-white relative overflow-hidden font-sans selection:bg-pink-500/30 pb-20">
      
      {/* AMBIENT BACKGROUND GLOWS (Tema Original) */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/10 to-transparent blur-[150px] -top-96 -left-96 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-[130px] top-1/2 -right-80 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/5 to-transparent blur-[160px] -bottom-96 left-1/3 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="h-[75vh] flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Pusat Data Interaktif Hubungan
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            Log Memori & Dokumentasi
          </h1>
          <p className="text-white/40 mt-4 text-xs md:text-sm max-w-lg mx-auto font-light leading-relaxed">
            Sistem pengarsipan digital terstruktur untuk memantau kronologi waktu, mencatat koordinat geografis, serta mengonsolidasikan aset dokumentasi visual secara berkala.
          </p>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">Gulir ke bawah</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* SEKSI 1: METRIK & KRONOLOGI (BENTO STYLE YANG LEBIH PADAT) */}
      <Section title="Metrik & Telemetri Waktu">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Durasi Utama */}
          <Card className="md:col-span-2 flex flex-col justify-between p-6 bg-gradient-to-br from-white/[0.04] to-transparent">
            <span className="text-white/40 text-xs uppercase tracking-wider">Akurasi Waktu Hubungan</span>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                {daysTogether} Hari
              </span>
              <span className="text-white/40 text-xs">Sejak 01 Januari 2024</span>
            </div>
          </Card>
          
          {/* Status Faktual */}
          <Card className="p-6 bg-white/[0.02]">
            <span className="text-white/40 text-xs uppercase tracking-wider">Status Hubungan Kontemporer</span>
            <div className="mt-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-pink-500/10 border border-pink-500/30 text-pink-400">
                ✔️ Status Aktif
              </span>
              <p className="text-lg font-medium mt-3">Kategori: Komitmen Tetap</p>
            </div>
          </Card>

          {/* Jarak Geografis */}
          <Card className="p-6 bg-white/[0.02]">
            <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Data Geografis (LDR)</span>
            <div className="mt-2 space-y-1">
              <p className="text-xl font-bold">± 780 Km</p>
              <p className="text-[11px] text-white/50">Estimasi Waktu Tempuh Udara: 1 Jam 45 Menit</p>
            </div>
          </Card>

          {/* Rencana Target (Milestone) */}
          <Card className="md:col-span-2 p-6 bg-white/[0.02] flex flex-col justify-between">
            <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Realisasi Target Bersama</span>
            <div className="space-y-3 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">Akumulasi Dana Tabungan Bersama</span>
                  <span className="text-purple-400 font-mono">85%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-purple-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">Perencanaan Alokasi Domisili Fisik</span>
                  <span className="text-white/30 font-mono">20%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[20%] h-full bg-white/40" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* SEKSI 2: ARSIP DOKUMENTASI VISUAL */}
      <Section title="Arsip Visual Terverifikasi">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", desc: "Dokumentasi Udara Laut" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", desc: "Pertemuan Logistik Kopi" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", desc: "Observasi Jalur Darat" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", desc: "Pencahayaan Sektoral Kota" },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", desc: "Analisis Batas Pantai" },
          ].map((photo, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 relative group cursor-pointer shadow-xl p-1"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <img 
                  src={photo.url} 
                  alt={photo.desc} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-2 font-mono flex justify-between items-center text-[10px]">
                <span className="text-white/50">KODE_0{i+1}</span>
                <span className="text-white/30 truncate max-w-[80px]">{photo.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SEKSI 3: REPOSITORI LATAR SUARA */}
      <Section title="Repositori Audio Terkurasi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Lover", artist: "Taylor Swift", duration: "03:41" },
            { title: "About You", artist: "The 1975", duration: "05:26" },
            { title: "Best Friend", artist: "Rex Orange County", duration: "04:21" },
            { title: "Untuk Perempuan Yang Sedang Di Pelukan", artist: "Payung Teduh", duration: "05:43" },
          ].map((track, i) => (
            <Card 
              key={i} 
              className={`p-4 flex items-center justify-between group bg-white/[0.02] hover:border-pink-500/30 cursor-pointer ${activeTrack === i ? 'border-pink-500/30' : ''}`}
              onClick={() => setActiveTrack(activeTrack === i ? null : i)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs">
                  {activeTrack === i ? "||" : `0${i+1}`}
                </div>
                <div>
                  <h3 className="font-medium text-xs text-white group-hover:text-pink-400 transition-colors">{track.title}</h3>
                  <p className="text-[11px] text-white/40">{track.artist}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 font-mono">
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

      {/* SEKSI 4: KAPSUL DATA & LOG AKTIVITAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-4 px-6 pb-12">
        
        {/* Catatan Terenkripsi */}
        <Card 
          className="p-5 bg-white/[0.02] md:col-span-1 cursor-pointer flex flex-col justify-between"
          onClick={() => setIsNoteDecrypted(!isNoteDecrypted)}
        >
          <div>
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block mb-2">Dekripsi Berkas Internal</span>
            <p className="text-xs font-light text-white/70 leading-relaxed font-mono">
              {isNoteDecrypted 
                ? "Sistem Konfirmasi: Dokumen ini mencatat komitmen bersama untuk mempertahankan konsistensi komunikasi harian, validasi berkala, dan penyelesaian masalah secara objektif." 
                : "Akses Terbatas. Klik komponen ini untuk melakukan verifikasi dekripsi berkas..."}
            </p>
          </div>
          <span className="text-[9px] text-white/30 font-mono mt-3 uppercase">{isNoteDecrypted ? "Metode: Terbuka" : "Metode: AES-256"}</span>
        </Card>
        
        {/* Log Aktivitas Terakhir */}
        <Card className="p-5 bg-white/[0.01] md:col-span-2 font-mono text-[11px] text-white/50 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-2">Log Pembaruan Sistem</span>
          <div className="space-y-1.5">
            <div className="flex justify-between border-b border-white/[0.03] pb-1">
              <span className="text-emerald-400">[INFO] TIMELINE_SYNC</span>
              <span>Penghitungan hari ke-{daysTogether} selesai diproses otomatis.</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1">
              <span className="text-blue-400">[DATA] ALBUM_ADDITION</span>
              <span>Pengunggahan 5 aset visual baru ke repositori awan berhasil.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400">[WARN] TARGET_REMINDER</span>
              <span>Tinjauan target keuangan jangka panjang dijadwalkan ulang.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-white/20 text-[10px] tracking-[0.25em] py-12 border-t border-white/[0.02] bg-black/20 font-mono">
        SISTEM PEMANTAUAN DATA HUBUNGAN — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

/* KONTEN WIDGET CONTAINER SEKSI */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6 py-12"
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

/* FORMAT BLOK CARD KOMPONEN */
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005, boxShadow: "0px 15px 30px rgba(244, 63, 94, 0.03)" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`
        rounded-2xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-md
        transition-all duration-300 ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
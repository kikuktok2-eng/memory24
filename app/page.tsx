"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./components/Loading";

interface Track {
  title: string;
  artist: string;
  duration: string;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [daysTogether, setDaysTogether] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [currentTimeJakarta, setCurrentTimeJakarta] = useState<string>("");
  const [currentTimeSurabaya, setCurrentTimeSurabaya] = useState<string>("");
  const [isCapsuleOpen, setIsCapsuleOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);

    // Kalkulasi Hari Jadi (Sejak 1 Januari 2024)
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    // Jam Sinkronisasi Lokasi
    const updateClocks = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setCurrentTimeJakarta(new Intl.DateTimeFormat('id-ID', options).format(now));
      setCurrentTimeSurabaya(new Intl.DateTimeFormat('id-ID', options).format(now)); // Sesuaikan zona waktu jika berbeda
    };
    
    updateClocks();
    const clockInterval = setInterval(updateClocks, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(clockInterval);
    };
  }, []);

  // Simulasi Progress Bar Musik
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    if (activeTrack !== null) {
      setTrackProgress(0);
      progressInterval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    } else {
      setTrackProgress(0);
    }
    return () => clearInterval(progressInterval);
  }, [activeTrack]);

  const playlist: Track[] = [
    { title: "Lover", artist: "Taylor Swift", duration: "03:41" },
    { title: "About You", artist: "The 1975", duration: "05:26" },
    { title: "Best Friend", artist: "Rex Orange County", duration: "04:21" },
    { title: "Untuk Perempuan Yang Sedang Di Pelukan", artist: "Payung Teduh", duration: "05:43" },
  ];

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#020408] text-slate-100 font-sans selection:bg-blue-500/30 pb-24 relative overflow-hidden">
      
      {/* ORNAMEN LATAR BELAKANG */}
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-blue-600/5 to-transparent blur-[140px] -top-60 -left-60 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-bl from-indigo-600/5 to-transparent blur-[140px] top-1/3 -right-60 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-slate-500/5 to-transparent blur-[150px] bottom-10 left-10 pointer-events-none" />

      {/* HEADER UTAMA */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6 relative border-b border-slate-900 bg-gradient-to-b from-transparent to-[#020408]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 max-w-3xl"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 bg-blue-500/5 px-3 py-1 border border-blue-500/10 rounded-full">
            Sistem Arsip Data Hubungan
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Pusat Data & Log Memori
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto font-normal leading-relaxed">
            Platform dokumentasi digital terstruktur untuk mencatat perkembangan hubungan, metrik perjalanan waktu, aset dokumentasi visual, serta koordinat geografis eksternal.
          </p>
        </motion.div>
      </section>

      {/* BENTO GRID UTAMA */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-4 -mt-12 relative z-10">
        
        {/* KOTAK 1: METRIK UTAMA WAKTU (Lebar: 2 Kolom) */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between bg-gradient-to-br from-slate-900/60 to-slate-950/40 min-h-[200px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 text-[10px] font-mono uppercase tracking-widest">Metrik Kronologi</span>
              <span className="text-slate-500 text-[10px] font-mono">ID: 2024-01-01</span>
            </div>
            <h3 className="text-white text-base font-semibold mt-2">Total Durasi Hubungan</h3>
          </div>
          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-7xl font-bold tracking-tighter text-white">
              {daysTogether}
            </span>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-medium">Hari Kerja Kalender</span>
              <span className="text-slate-500 text-[10px] font-mono">Akurasi data: 100%</span>
            </div>
          </div>
        </Card>

        {/* KOTAK 2: MATRIKS TELEMETRI JARAK & GEOGRAFIS (Lebar: 2 Kolom) */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-between bg-slate-900/20">
          <div>
            <span className="text-indigo-400 text-[10px] font-mono uppercase tracking-widest">Data Geografis</span>
            <h3 className="text-white text-base font-semibold mt-1">Status Pemantauan Jarak (LDR)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Jarak Fisik</p>
              <p className="text-xl font-bold text-slate-200">± 780 Kilometer</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">Estimasi Tempuh</p>
              <p className="text-xl font-bold text-slate-200">1j 45m (Udara)</p>
            </div>
          </div>
          <div className="w-full bg-slate-950 rounded-lg p-2 flex justify-between items-center border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400">Jkt: {currentTimeJakarta}</span>
            <div className="w-8 h-[1px] bg-slate-700 dashboard-line" />
            <span className="text-slate-400">Sub: {currentTimeSurabaya}</span>
          </div>
        </Card>

        {/* KOTAK 3: JADWAL AGENDA TERDEKAT */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">Penjadwalan</span>
            <h4 className="text-sm font-semibold text-white mt-1">Pertemuan Berikutnya</h4>
          </div>
          <div className="my-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 text-center">
              <p className="text-lg font-mono font-bold text-emerald-400">42 Hari</p>
              <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Menuju Sinkronisasi Fisik</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">Agenda: Rencana Cuti Bersama & Evaluasi Pertengahan Tahun.</p>
        </Card>

        {/* KOTAK 4: DAFTAR TARGET & PROGRESS BAR */}
        <Card className="p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-purple-400 text-[10px] font-mono uppercase tracking-widest">Manajemen Target</span>
            <h4 className="text-sm font-semibold text-white mt-1">Rencana Jangka Panjang</h4>
          </div>
          <div className="space-y-3 my-3">
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-300">Tabungan Bersama (Tahap I)</span>
                <span className="text-purple-400">85%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="w-[85%] h-full bg-purple-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-300">Pengadaan Domisili Tetap</span>
                <span className="text-slate-500">20%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="w-[20%] h-full bg-slate-700" />
              </div>
            </div>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Terakhir diperbarui: 2 minggu lalu</span>
        </Card>

        {/* KOTAK 5: KAPSUL WAKTU INTERAKTIF */}
        <Card 
          className="p-5 flex flex-col justify-between bg-gradient-to-t from-amber-500/[0.02] to-transparent border-slate-800/80 cursor-pointer"
          onClick={() => setIsCapsuleOpen(!isCapsuleOpen)}
        >
          <div className="flex justify-between items-center">
            <span className="text-amber-400 text-[10px] font-mono uppercase tracking-widest">Kapsul Waktu</span>
            <div className={`w-2 'bg-amber-400' h-2 rounded-full ${isCapsuleOpen ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
          </div>
          <div className="my-2">
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {isCapsuleOpen 
                ? "Catatan Sistem: Komitmen fundamental berorientasi pada stabilitas jangka panjang, kepatuhan komunikasi harian, serta penyelesaian konflik secara objektif tanpa retorika berlebihan." 
                : "Akses Terkunci. Klik untuk melakukan dekripsi pesan internal."}
            </p>
          </div>
          <span className="text-[9px] text-slate-500 font-mono uppercase">{isCapsuleOpen ? "Status: Dekripsi Berhasil" : "Metode: AES-256 Otentikasi"}</span>
        </Card>

      </section>

      {/* ARSIP DOKUMENTASI VISUAL */}
      <Section title="Arsip Visual Terverifikasi">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", tag: "LOG_01", loc: "Koordinat Wilayah A" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", tag: "LOG_02", loc: "Arsip Pertemuan II" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", tag: "LOG_03", loc: "Perjalanan Dinas Bersama" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", tag: "LOG_04", loc: "Dokumentasi Kuartal IV" },
          ].map((photo, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 p-2 group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg relative aspect-[4/3] bg-slate-950">
                <img 
                  src={photo.url} 
                  alt={photo.loc} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 flex justify-between items-center px-1 font-mono">
                <span className="text-[9px] text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10">{photo.tag}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{photo.loc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* REPOSITORI LATAR SUARA */}
      <Section title="Repositori Audio Hubungan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {playlist.map((track, i) => (
            <Card 
              key={i} 
              className={`p-3 flex items-center justify-between group cursor-pointer transition-colors ${activeTrack === i ? 'border-blue-500/30 bg-blue-500/[0.02]' : 'bg-slate-900/10'}`}
              onClick={() => setActiveTrack(activeTrack === i ? null : i)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 font-mono text-xs">
                  {activeTrack === i ? <span className="text-blue-400 text-[10px]">||</span> : "0" + (i + 1)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-xs text-slate-200 group-hover:text-blue-400 transition-colors truncate">{track.title}</h3>
                  <p className="text-[10px] text-slate-500 truncate">{track.artist}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0 font-mono">
                <span className="text-[9px] text-slate-500">{track.duration}</span>
                <div className="w-16 h-[2px] bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: activeTrack === i ? `${trackProgress}%` : "0%" }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* LOG AKTIVITAS SISTEM */}
      <Section title="Log Aktivitas Sistem Terakhir">
        <div className="w-full bg-slate-950/50 border border-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
            <span className="text-emerald-500">[SUKSES] SYNC_TIME_ZONES</span>
            <span className="text-slate-600">Sinkronisasi Waktu Jakarta-Surabaya Selesai</span>
          </div>
          <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
            <span className="text-blue-500">[INFO] ALBUM_UPDATED</span>
            <span className="text-slate-600">Menambahkan 4 berkas visual ke dalam arsip digital</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-500">[SISTEM] TRACKER_ACTIVE</span>
            <span className="text-slate-600">Menghitung otomatis hari ke-{daysTogether} secara berkala</span>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="text-center text-slate-600 font-mono text-[9px] tracking-[0.3em] pt-16 pb-4 uppercase">
        Sistem Manajemen Log Memori Progresif — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

/* CONTAINER KOMPONEN SEKSI */
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
        <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500 font-bold whitespace-nowrap">
          {title}
        </h2>
        <div className="w-full h-[1px] bg-slate-900" />
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

/* DOCK CARD BENTO */
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2, border: "1px solid rgba(59, 130, 246, 0.2)" }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        rounded-xl border border-slate-900 bg-[#070c14]/40 backdrop-blur-sm
        transition-all duration-200 ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
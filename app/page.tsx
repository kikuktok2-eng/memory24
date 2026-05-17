"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isNoteDecrypted, setIsNoteDecrypted] = useState(false);
  const [myMood, setMyMood] = useState("Vibe: Lagi Kangen Berat");
  const [partnerMood, setPartnerMood] = useState("Vibe: Butuh Deep Talk");

  // ==========================================
  // STATE UNTUK 5 MINI GAMES
  // ==========================================
  // Game 1: Clicker
  const [loveClicks, setLoveClicks] = useState(0);
  // Game 2: Shell Game (Tebak Hati)
  const [shellResult, setShellResult] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  // Game 3: Scratch Coupon
  const [isScratched, setIsScratched] = useState(false);
  // Game 4: Quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  // Game 5: Word Puzzle
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [puzzleWin, setPuzzleWin] = useState(false);

  const correctSentence = ["Kamu", "Adalah", "Semesta", "Paling", "Indah"];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    // Init Word Puzzle Acak
    setShuffledWords([...correctSentence].sort(() => Math.random() - 0.5));

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

  // Handler Game 2: Tebak Hati
  const playShellGame = () => {
    setIsShuffling(true);
    setShellResult(null);
    setTimeout(() => {
      setIsShuffling(false);
      const items = ["💔 Kosong", "❤️ Bonus Peluk!", "💔 Zonk"];
      setShellResult(items[Math.floor(Math.random() * items.length)]);
    }, 800);
  };

  // Handler Game 4: Kuis
  const quizData = [
    { q: "Mana date spot yang paling core kita banget?", a: ["Ngopi Senja", "MCD 24 Jam", "Deep Talk Motoran"], c: 2 },
    { q: "Siapa yang paling sering ngambek gak jelas?", a: ["Aku", "Kamu", "Dua-duanya sama"], c: 1 },
    { q: "Apa love language utama aku ke kamu?", a: ["Words of Affirmation", "Physical Touch", "Acts of Service"], c: 0 }
  ];

  const handleQuizAnswer = (index: number) => {
    if (index === quizData[currentQuestion].c) {
      setQuizScore(quizScore + 1);
    }
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Handler Game 5: Puzzle Kata
  const handleWordClick = (word: string, index: number) => {
    const updatedSelected = [...selectedWords, word];
    setSelectedWords(updatedSelected);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));

    if (updatedSelected.length === correctSentence.length) {
      if (JSON.stringify(updatedSelected) === JSON.stringify(correctSentence)) {
        setPuzzleWin(true);
      }
    }
  };

  const resetPuzzle = () => {
    setSelectedWords([]);
    setShuffledWords([...correctSentence].sort(() => Math.random() - 0.5));
    setPuzzleWin(false);
  };

  const moodList = ["Vibe: Lagi Kangen Berat", "Vibe: Butuh Deep Talk", "Vibe: Pengen Ketemu", "Vibe: Salting Brutal", "Vibe: Safe Place Kamu"];
  const rotateMood = (current: string, setMood: (m: string) => void) => {
    const currentIndex = moodList.indexOf(current);
    const nextIndex = (currentIndex + 1) % moodList.length;
    setMood(moodList[nextIndex]);
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#05070c] text-white relative overflow-hidden font-sans selection:bg-pink-500/30 pb-20">
      
      {/* GLOW BACKGROUND */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/10 to-transparent blur-[150px] -top-96 -left-96 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-[130px] top-1/2 -right-80 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Our Tiny Universe // Edisi Skena Arcade</span>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">Us Against The World.</h1>
          <p className="text-white/40 mt-4 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">Tempat rahasia buat nyimpen semua tawa kita, lengkap dengan playground mini biar kita ga bosen pas lagi LDR-an.</p>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll Buat Main Game</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ==========================================
          SEKSI UTAMA: PLAYGROUND MINI GAMES (TIKTOK VIBE)
          ========================================== */}
      <Section title="🕹️ Skena Arcade Zone (Anti Gabut)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [perspective:1000px]">
          
          {/* GAME 1: LOVE COMPATIBILITY CLICKER */}
          <Card className="p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Game 01 // Kangen Booster</span>
              <h3 className="text-sm font-bold mt-1 text-white">Love Compatibility Clicker</h3>
              <p className="text-[11px] text-white/40 mt-1">Klik tombol hati di bawah buat transfer kangen kamu secara brutal!</p>
            </div>
            <div className="my-3 text-center">
              <span className="text-3xl font-black block text-pink-500">{loveClicks * 10}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-pink-500 transition-all duration-200" style={{ width: `${Math.min(loveClicks * 10, 100)}%` }} />
              </div>
            </div>
            <button onClick={() => setLoveClicks(prev => prev >= 10 ? 0 : prev + 1)} className="w-full py-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 rounded-lg text-xs font-medium font-mono transition-colors">
              {loveClicks >= 10 ? "Reset Energi Cinta" : "⚡ SEND LOVE ATTACK"}
            </button>
          </Card>

          {/* GAME 2: LOVE LANGUAGE SHELL GAME */}
          <Card className="p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Game 02 // Tebak Hati</span>
              <h3 className="text-sm font-bold mt-1 text-white">Gacha Keberuntungan Cinta</h3>
              <p className="text-[11px] text-white/40 mt-1">Cari kartu yang isinya "❤️ Bonus Peluk" di antara zonk.</p>
            </div>
            <div className="text-center my-2 h-10 flex items-center justify-center">
              {isShuffling ? (
                <span className="text-xs text-white/50 animate-pulse font-mono">Mengacak Semesta...</span>
              ) : shellResult ? (
                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">{shellResult}</span>
              ) : (
                <span className="text-xs text-white/30 italic">Tiga opsi misterius menantimu</span>
              )}
            </div>
            <button onClick={playShellGame} disabled={isShuffling} className="w-full py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium font-mono transition-colors">
              🎰 BUKA KOTAK MISTERI
            </button>
          </Card>

          {/* GAME 3: DAILY AFFIRMATION SCRATCH */}
          <Card className="p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Game 03 // Gosok Kupon</span>
              <h3 className="text-sm font-bold mt-1 text-white">Affirmation Core Card</h3>
              <p className="text-[11px] text-white/40 mt-1">Gosok/klik lapisan abu-abu di bawah buat klaim afeksi manis hari ini.</p>
            </div>
            <div className="my-3 relative h-12 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center bg-white/[0.02]">
              <span className="text-[11px] font-mono text-center px-2 text-purple-300">"Hari ini kamu cakep banget, jangan lupa makan ya sayang!"</span>
              {!isScratched && (
                <motion.div onClick={() => setIsScratched(true)} className="absolute inset-0 bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-[11px] text-white/40 font-mono cursor-pointer transition-colors select-none">
                  ░ GOSOK DI SINI ░
                </motion.div>
              )}
            </div>
            {isScratched && (
              <button onClick={() => setIsScratched(false)} className="text-[10px] text-white/30 underline text-center block font-mono">Tutup Kupon Lagi</button>
            )}
          </Card>

          {/* GAME 4: RELATIONSHIP QUIZ */}
          <Card className="p-5 flex flex-col justify-between min-h-[220px] md:col-span-1 lg:col-span-1">
            <div>
              <span className="text-amber-400 text-[10px] font-mono uppercase tracking-wider">Game 04 // Uji Seberapa Kenal</span>
              <h3 className="text-sm font-bold mt-1 text-white">Kuis Core Hubungan kita</h3>
            </div>
            <div className="my-2">
              {!quizFinished ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-white/70 font-medium truncate">{quizData[currentQuestion].q}</p>
                  <div className="grid grid-cols-1 gap-1">
                    {quizData[currentQuestion].a.map((opt, idx) => (
                      <button key={idx} onClick={() => handleQuizAnswer(idx)} className="text-left text-[10px] p-1.5 bg-white/[0.02] border border-white/5 rounded hover:bg-white/5 text-white/80 transition-colors truncate">
                        {idx + 1}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <p className="text-xs text-emerald-400 font-bold">Skor Kamu: {quizScore}/{quizData.length} Cocok!</p>
                  <button onClick={() => { setCurrentQuestion(0); setQuizScore(0); setQuizFinished(false); }} className="text-[10px] text-white/40 underline font-mono mt-1">Ulangi Kuis</button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-white/30 font-mono uppercase">Database Pertanyaan Romantis</span>
          </Card>

          {/* GAME 5: LOVE LETTER WORD PUZZLE */}
          <Card className="p-5 flex flex-col justify-between min-h-[220px] md:col-span-2">
            <div>
              <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider">Game 05 // Susun Surat Cinta</span>
              <h3 className="text-sm font-bold mt-1 text-white">Love Word Scrambler</h3>
              <p className="text-[11px] text-white/40 mt-1">Urutin kata-kata acak di bawah biar jadi kalimat afeksi utuh.</p>
            </div>
            <div className="my-2 space-y-2">
              {/* Hasil Pilihan */}
              <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg min-h-[32px] flex flex-wrap gap-1 items-center">
                {selectedWords.map((w, i) => (
                  <span key={i} className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">{w}</span>
                ))}
                {selectedWords.length === 0 && <span className="text-[10px] text-white/20 italic">Klik kata di bawah...</span>}
              </div>
              {/* Pilihan Acak */}
              <div className="flex flex-wrap gap-1">
                {shuffledWords.map((word, index) => (
                  <button key={index} onClick={() => handleWordClick(word, index)} className="text-[10px] bg-white/[0.03] hover:bg-white/10 border border-white/5 px-2 py-1 rounded transition-colors text-white/80">
                    {word}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-400">{puzzleWin ? "🎉 Kamu Bener Banget!" : " "}</span>
              <button onClick={resetPuzzle} className="text-[10px] text-white/40 underline font-mono">Reset Susunan</button>
            </div>
          </Card>

        </div>
      </Section>

      {/* ==========================================
          SEKSI DASHBOARD INFORMASI (BENTO LAMA KEMBALI)
          ========================================== */}
      <Section title="📊 Dashboard Telemetri & Log Aktivitas">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 [perspective:1000px]">
          
          <Card className="p-6 sm:col-span-2 flex flex-col justify-between bg-gradient-to-br from-white/[0.03] to-transparent min-h-[180px]">
            <div className="flex justify-between items-start">
              <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Masa Berlayar Berdua</span>
              <span className="text-white/30 text-[10px] font-mono">SINCE 01/01/2024</span>
            </div>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">{daysTogether} Hari Cinta</span>
              <span className="text-white/40 text-xs">Tiap detiknya berharga, ga mau nuker kamu sama apa pun.</span>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[180px]">
            <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Lagi Mikirin Apa Ya?</span>
            <div className="space-y-2 my-2">
              <div className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => rotateMood(myMood, setMyMood)}>
                <span className="text-[11px] text-white/40">Aku:</span>
                <span className="text-xs font-medium text-white">{myMood}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => rotateMood(partnerMood, setPartnerMood)}>
                <span className="text-[11px] text-white/40">Kamu:</span>
                <span className="text-xs font-medium text-white">{partnerMood}</span>
              </div>
            </div>
            <span className="text-[9px] text-white/30 text-center block font-mono">TAP BUAT UPDATE VIBE KAMU</span>
          </Card>

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

        </div>
      </Section>

      {/* REPOSITORI FOTO & AUDIO */}
      <Section title="📸 Our Visual Dump & Core Memories">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", desc: "Waktu Cari Senja" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", desc: "Date Ngopi Random" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", desc: "Pap Cantik Kamu" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", desc: "Deep Talk Malam" },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", desc: "Liburan Singkat" },
          ].map((photo, i) => (
            <Card key={i} className="overflow-hidden bg-white/5 relative group p-1.5">
              <div className="aspect-[4/5] overflow-hidden rounded-xl relative">
                <img src={photo.url} alt={photo.desc} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              </div>
              <div className="p-2 font-mono flex justify-between items-center text-[10px]">
                <span className="text-white/40">CUTE_0{i+1}</span>
                <span className="text-white/20 truncate max-w-[70px]">{photo.desc}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="🎵 Lagu Yang Menggambarkan Kamu">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Lover", artist: "Taylor Swift", duration: "03:41" },
            { title: "About You", artist: "The 1975", duration: "05:26" },
          ].map((track, i) => (
            <Card key={i} className={`p-4 flex items-center justify-between group bg-white/[0.02] cursor-pointer ${activeTrack === i ? 'border-pink-500/40 bg-white/[0.04]' : ''}`} onClick={() => setActiveTrack(activeTrack === i ? null : i)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs">
                  {activeTrack === i ? "⏸️" : `0${i+1}`}
                </div>
                <div>
                  <h3 className="font-medium text-xs text-white group-hover:text-pink-400 transition-colors">{track.title}</h3>
                  <p className="text-[11px] text-white/40">{track.artist}</p>
                </div>
              </div>
              <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: activeTrack === i ? `${trackProgress}%` : "0%" }} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* LOCKER MESSAGE & SYSTEM TERMINAL LOG */}
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-4 px-6 pb-12 [perspective:1000px]">
        <Card className="p-5 bg-white/[0.02] md:col-span-1 cursor-pointer flex flex-col justify-between min-h-[160px]" onClick={() => setIsNoteDecrypted(!isNoteDecrypted)}>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block mb-2">Pesan Rahasia Buat Kamu</span>
            <p className="text-xs font-light text-white/70 leading-relaxed font-mono">
              {isNoteDecrypted ? "Makasih banyak ya udah selalu sabar, chill, dan jadi safe place paling nyaman buat aku. I love you! ❤️" : "Ada surat cinta dikunci nih. Klik buat baca..."}
            </p>
          </div>
          <span className="text-[9px] text-white/30 font-mono mt-3 uppercase">{isNoteDecrypted ? "STATUS: UNLOCKED" : "STATUS: LOCKED"}</span>
        </Card>

        <Card className="p-5 bg-white/[0.01] md:col-span-2 font-mono text-[11px] text-white/50 flex flex-col justify-between min-h-[160px]">
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-2">Our Love System Status</span>
          <div className="space-y-1.5">
            <div className="flex justify-between border-b border-white/[0.03] pb-1">
              <span className="text-emerald-400">[INFO] LOVE_STREAK</span>
              <span>Hari ke-{daysTogether} bareng kamu dan sayangnya masih nambah terus.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-400">[WARN] MISSING_YOU</span>
              <span>Sinyal kangen mendadak naik drastis, butuh peluk secepatnya.</span>
            </div>
          </div>
        </Card>
      </div>

      <footer className="text-center text-white/20 text-[10px] tracking-[0.25em] py-12 border-t border-white/[0.02] bg-black/20 font-mono">
        KITA BISA MELEWATI INI BARENG — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 font-bold whitespace-nowrap">{title}</h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      {children}
    </motion.section>
  );
}

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
    const xCoord = e.clientX - rect.left - rect.width / 2;
    const yCoord = e.clientY - rect.top - rect.height / 2;
    rotateX.set(-(yCoord / rect.height) * 14); 
    rotateY.set((xCoord / rect.width) * 14);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const backgroundImage = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(244, 63, 94, 0.08), transparent 80%)`;

  return (
    <motion.div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} whileHover={{ y: -5, scale: 1.015 }} onClick={onClick} className={`rounded-2xl border border-white/[0.08] bg-[#07090e]/70 backdrop-blur-md transition-all duration-150 ease-out select-none relative group ${className}`}>
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-300" style={{ backgroundImage }} />
      <div style={{ transform: "translateZ(25px)" }} className="h-full w-full relative z-10">{children}</div>
    </motion.div>
  );
}
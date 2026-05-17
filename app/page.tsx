"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import Loading from "./components/Loading";
import { supabase } from "@/utils/supabase"; // Import client Supabase kamu

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isNoteDecrypted, setIsNoteDecrypted] = useState(false);
  
  // State Vibe/Mood
  const [myMood, setMyMood] = useState("Vibe: Lagi Kangen Berat");
  const [partnerMood, setPartnerMood] = useState("Vibe: Butuh Deep Talk");

  // ==========================================================
  // STATE DINAMIS YANG DISINKRONKAN DENGAN DATABASE SUPABASE
  // ==========================================================
  const [customLdr, setCustomLdr] = useState("± 780 Km Antara Kita");
  const [secretNote, setSecretNote] = useState("Makasih banyak ya udah selalu sabar, chill, dan jadi safe place paling nyaman buat aku. I love you! ❤️");
  const [homeLatitude, setHomeLatitude] = useState("-6.1751"); 
  const [homeLongitude, setHomeLongitude] = useState("106.8272");
  const [homeLabel, setHomeLabel] = useState("Rumah Kesayangan");

  const [clickMissions, setClickMissions] = useState<any[]>([]);
  const [gachaPool, setGachaPool] = useState<any[]>([]);
  const [scratchNotes, setScratchNotes] = useState<any[]>([]);
  const [quizPool, setQuizPool] = useState<any[]>([]);
  const [puzzleSentences, setPuzzleSentences] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);

  // ==========================================
  // STATE PROGRESS GAMEPLAY USER
  // ==========================================
  const [clickStage, setClickStage] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [gachaStage, setGachaStage] = useState(0);
  const [gachaResult, setGachaResult] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [scratchStage, setScratchStage] = useState(0);
  const [isScratched, setIsScratched] = useState(false);
  const [quizStage, setQuizStage] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [puzzleStage, setPuzzleStage] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [puzzleWin, setPuzzleWin] = useState(false);

  // ==========================================
  // 1. SINKRONISASI DATA DARI SUPABASE CLOUD
  // ==========================================
  useEffect(() => {
    // Perhitungan Hari Jadian
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    const fetchSupabaseData = async () => {
      try {
        // Ambil satu baris konfigurasi utama dari tabel web_config
        const { data, error } = await supabase
          .from("web_config")
          .select("*")
          .single();

        if (error) throw error;

        if (data) {
          if (data.status_ldr) setCustomLdr(data.status_ldr);
          if (data.pesan_rahasia) setSecretNote(data.pesan_rahasia);
          if (data.latitude) setHomeLatitude(String(data.latitude));
          if (data.longitude) setHomeLongitude(String(data.longitude));
          if (data.lokasi_utama) setHomeLabel(data.lokasi_utama);

          // Tarik data komponen array / objek (JSONB)
          if (data.audio_tracks) setTracks(data.audio_tracks);
          if (data.galeri_foto) setPhotos(data.galeri_foto);
          if (data.click_missions) setClickMissions(data.click_missions);
          if (data.scratch_notes) setScratchNotes(data.scratch_notes);
          if (data.quiz_pool) setQuizPool(data.quiz_pool);
          
          if (data.gacha_pool) {
            setGachaPool(data.gacha_pool);
          }

          // Konstruksi khusus untuk rekonstruksi game Puzzle Scrambler
          if (data.game_scrambler) {
            const rawSentences: string[] = data.game_scrambler;
            const currentPuzzleData = rawSentences.map(sentence => 
              sentence.split(",").map(w => w.trim())
            );
            setPuzzleSentences(currentPuzzleData);

            // Set state game stage puzzle lokal user
            const savedPuzzleStage = localStorage.getItem("puzzleStage");
            const pStage = savedPuzzleStage ? Number(savedPuzzleStage) : 0;
            const targetStage = currentPuzzleData[pStage] ? pStage : 0;
            
            setPuzzleStage(targetStage);
            setShuffledWords([...currentPuzzleData[targetStage]].sort(() => Math.random() - 0.5));
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data dari Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();

    // Ambil Progres Gameplay Lokal User (Biar tidak bentrok antar browser)
    const savedClickStage = localStorage.getItem("clickStage");
    const savedQuizStage = localStorage.getItem("quizStage");

    if (savedClickStage) setClickStage(Number(savedClickStage));
    if (savedQuizStage) setQuizStage(Number(savedQuizStage));
  }, []);

  // 2. Efek Audio Track Progress Gimmick
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

  // Helper Puzzle Reset/Init
  const initPuzzle = (stageIdx: number) => {
    setSelectedWords([]);
    setPuzzleWin(false);
    if (puzzleSentences[stageIdx]) {
      setShuffledWords([...puzzleSentences[stageIdx]].sort(() => Math.random() - 0.5));
    }
  };

  const handleClicker = () => {
    const currentMission = clickMissions[clickStage];
    if (!currentMission) return;

    if (clickCount + 1 >= currentMission.target) {
      setClickCount(currentMission.target);
      setTimeout(() => {
        const nextStage = (clickStage + 1) % clickMissions.length;
        setClickStage(nextStage);
        localStorage.setItem("clickStage", String(nextStage)); 
        setClickCount(0);
      }, 1000);
    } else {
      setClickCount(prev => prev + 1);
    }
  };

  const playGacha = () => {
    if (gachaPool.length === 0) return;
    setIsShuffling(true);
    setGachaResult(null);
    setTimeout(() => {
      setIsShuffling(false);
      const currentPool = gachaPool[gachaStage % gachaPool.length];
      const winResult = currentPool[Math.floor(Math.random() * currentPool.length)];
      setGachaResult(winResult);
      
      if (winResult && !winResult.includes("💔")) {
        setTimeout(() => {
          setGachaStage((prev) => (prev + 1) % gachaPool.length);
          setGachaResult(null);
        }, 1500);
      }
    }, 800);
  };

  const handleQuiz = (idx: number) => {
    const currentQuiz = quizPool[quizStage];
    if (!currentQuiz) return;

    if (idx === currentQuiz.c) {
      setQuizFeedback("✨ Bener Banget! Lanjut level berikutnya...");
      setTimeout(() => {
        setQuizFeedback(null);
        if (quizStage + 1 < quizPool.length) {
          const nextQuiz = quizStage + 1;
          setQuizStage(nextQuiz);
          localStorage.setItem("quizStage", String(nextQuiz)); 
        } else {
          setQuizFinished(true);
        }
      }, 1200);
    } else {
      setQuizFeedback("❌ Duh salah, coba tebak lagi deh!");
    }
  };

  const handleWordClick = (word: string, index: number) => {
    const currentSentence = puzzleSentences[puzzleStage];
    if (!currentSentence) return;

    const updated = [...selectedWords, word];
    setSelectedWords(updated);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));

    if (updated.length === currentSentence.length) {
      if (JSON.stringify(updated) === JSON.stringify(currentSentence)) {
        setPuzzleWin(true);
        setTimeout(() => {
          const nextStage = (puzzleStage + 1) % puzzleSentences.length;
          setPuzzleStage(nextStage);
          localStorage.setItem("puzzleStage", String(nextStage)); 
          setSelectedWords([]);
          setPuzzleWin(false);
          setShuffledWords([...puzzleSentences[nextStage]].sort(() => Math.random() - 0.5));
        }, 1500);
      } else {
        setTimeout(() => {
          initPuzzle(puzzleStage);
        }, 1000);
      }
    }
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
          <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Our Tiny Universe // Edisi Skena Arcade Leveling</span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{customLdr}</h1>
          <p className="text-white/40 mt-4 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">Selesaikan setiap misi buat ngebuka level selanjutnya. Kuis, gacha, dan kata-katanya bakal tersimpan otomatis!</p>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll Buat Main Game Misi</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* DYNAMIC ARCADE ZONE */}
      <Section title="🕹️ Skena Arcade Zone (Progres Tersimpan)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 [perspective:1000px]">
          
          {/* GAME 1: CLICKER TANTANGAN */}
          <Card className="p-5 flex flex-col justify-between min-h-[230px]">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Misi Ke-0{clickStage + 1}</span>
                <span className="text-[9px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">LIVE STAGE</span>
              </div>
              <h3 className="text-sm font-bold mt-1 text-white">{clickMissions[clickStage]?.title || "Misi Selesai"}</h3>
              <p className="text-[11px] text-white/40 mt-1">Spam klik tombol di bawah sampai target terpenuhi buat klaim *reward*.</p>
            </div>
            <div className="my-2 text-center">
              <span className="text-2xl font-black block text-pink-500 font-mono">
                {clickCount} / {clickMissions[clickStage]?.target || 0}
              </span>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                <div className={`h-full bg-gradient-to-r ${clickMissions[clickStage]?.color || "from-pink-500 to-purple-500"} transition-all duration-150`} style={{ width: `${(clickCount / (clickMissions[clickStage]?.target || 1)) * 100}%` }} />
              </div>
            </div>
            <button onClick={handleClicker} className="w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 rounded-lg text-xs font-medium font-mono transition-colors">
              {clickCount === clickMissions[clickStage]?.target ? "🎉 MISI CLEAR! LOADING..." : "⚡ TAP / SPAM DISINI"}
            </button>
          </Card>

          {/* GAME 2: GACHA REWARD */}
          <Card className="p-5 flex flex-col justify-between min-h-[230px]">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 text-[10px] font-mono uppercase tracking-wider">Pool Tier-0{gachaStage + 1}</span>
                {gachaStage > 0 && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">UPGRADED</span>}
              </div>
              <h3 className="text-sm font-bold mt-1 text-white">Gacha Keberuntungan Skena</h3>
              <p className="text-[11px] text-white/40 mt-1">Dapet hadiah romantis? Pool gacha bakal naik tier otomatis kalau kamu menang.</p>
            </div>
            <div className="text-center my-2 h-10 flex items-center justify-center">
              {isShuffling ? (
                <span className="text-xs text-white/50 animate-pulse font-mono">Mengocok Hadiah Baru...</span>
              ) : gachaResult ? (
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">{gachaResult}</span>
              ) : (
                <span className="text-xs text-white/30 italic">Coba test hoki cinta kamu hari ini</span>
              )}
            </div>
            <button onClick={playGacha} disabled={isShuffling} className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium font-mono transition-colors">
              {isShuffling ? "🎰 SHUFFLING..." : "🎰 SPIN GACHA SEKARANG"}
            </button>
          </Card>

          {/* GAME 3: KUPON GOSOK SHIFTING */}
          <Card className="p-5 flex flex-col justify-between min-h-[230px]">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Tiket Berubah Ke-0{scratchStage + 1}</span>
              </div>
              <h3 className="text-sm font-bold mt-1 text-white">Daily Affirmation Card</h3>
              <p className="text-[11px] text-white/40 mt-1">Gosok lapisan penutup. Klik ganti kupon setelah dibaca buat dapet teks baru.</p>
            </div>
            <div className="my-2 relative h-14 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center bg-white/[0.02]">
              <span className="text-[11px] font-mono text-center px-3 text-purple-300">{scratchNotes[scratchStage] || "Kupon Kosong"}</span>
              {!isScratched && (
                <div onClick={() => setIsScratched(true)} className="absolute inset-0 bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-[10px] text-white/40 font-mono cursor-pointer transition-colors select-none">
                  ░ KLIK / GOSOK LAPISAN ░
                </div>
              )}
            </div>
            {isScratched && (
              <button onClick={() => { setIsScratched(false); setScratchStage((prev) => (prev + 1) % scratchNotes.length); }} className="w-full py-2 text-center block font-mono text-[10px] text-purple-400/80 bg-purple-500/5 rounded hover:bg-purple-500/10 border border-purple-500/10 transition-colors">
                ✨ KLAIM & GANTI KUPON BARU
              </button>
            )}
          </Card>

          {/* GAME 4: TRIVIA QUIZ BERTINGKAT */}
          <Card className="p-5 flex flex-col justify-between min-h-[230px]">
            <div>
              <span className="text-amber-400 text-[10px] font-mono uppercase tracking-wider">Kuis Stage 0{quizStage + 1} / 0{quizPool.length}</span>
              <h3 className="text-sm font-bold mt-1 text-white">Seberapa Kenal Kamu?</h3>
            </div>
            <div className="my-2 min-h-[90px] flex flex-col justify-center">
              {!quizFinished && quizPool[quizStage] ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-white/80 font-medium leading-tight">{quizPool[quizStage]?.q}</p>
                  {quizFeedback ? (
                    <p className="text-[10px] text-amber-400 font-mono bg-amber-500/5 p-1 rounded border border-amber-500/10 text-center">{quizFeedback}</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-1">
                      {quizPool[quizStage]?.a.map((opt: string, idx: number) => (
                        <button key={idx} onClick={() => handleQuiz(idx)} className="text-left text-[10px] p-1.5 bg-white/[0.02] border border-white/5 rounded hover:bg-white/5 text-white/70 transition-colors truncate">
                          {idx + 1}. {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-emerald-400 font-bold">🎉 Semua Kuis Dilibas Abis!</p>
                  <p className="text-[10px] text-white/40 mt-1">Kamu emang beneran paham luar dalem tentang aku.</p>
                  <button onClick={() => { setQuizStage(0); setQuizFinished(false); localStorage.removeItem("quizStage"); }} className="text-[10px] text-amber-400 underline font-mono mt-2 block mx-auto">Reset Sesi Kuis</button>
                </div>
              )}
            </div>
            <span className="text-[9px] text-white/20 font-mono">AUTOMATIC LEVEL PROGRESSION</span>
          </Card>

          {/* GAME 5: WORD SCRAMBLER PUZZLE */}
          <Card className="p-5 flex flex-col justify-between min-h-[230px] md:col-span-2">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider">Kalimat Era Ke-0{puzzleStage + 1}</span>
                <span className="text-[9px] text-white/30 font-mono">Auto-shuffling</span>
              </div>
              <h3 className="text-sm font-bold mt-1 text-white">Love Word Scrambler System</h3>
              <p className="text-[11px] text-white/40 mt-1">Urutin rangkaian kata di bawah. Sukses menyusun bakal langsung ngelempar kamu ke stage kata berikutnya!</p>
            </div>
            <div className="my-2 space-y-2">
              <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg min-h-[36px] flex flex-wrap gap-1.5 items-center">
                {selectedWords.map((w, i) => (
                  <span key={i} className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium font-mono">{w}</span>
                ))}
                {selectedWords.length === 0 && <span className="text-[10px] text-white/20 italic font-mono">Tap susunan kata di bawah...</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shuffledWords.map((word, index) => (
                  <button key={index} onClick={() => handleWordClick(word, index)} className="text-[10px] bg-white/[0.03] hover:bg-white/10 border border-white/5 px-2.5 py-1 rounded transition-colors text-white/80 font-mono">
                    {word}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-400 font-mono">{puzzleWin ? "🎉 STAGE COMPLETE! LOADING NEXT ERA..." : "⚡ Susun dengan benar"}</span>
              <button onClick={() => initPuzzle(puzzleStage)} className="text-[10px] text-white/40 underline font-mono">Ulangi Stage Ini</button>
            </div>
          </Card>

        </div>
      </Section>

      {/* CORE MEMORIES & TELEMETRY SECTION */}
      <Section title="📊 Dashboard Telemetri & Log Aktivitas">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 sm:col-span-2 flex flex-col justify-between bg-gradient-to-br from-white/[0.03] to-transparent min-h-[180px]">
            <div className="flex justify-between items-start">
              <span className="text-pink-400 text-[10px] font-mono uppercase tracking-wider">Masa Berlayar Berdua</span>
              <span className="text-white/30 text-[10px] font-mono">SINCE 01/01/2024</span>
            </div>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">{daysTogether} Hari</span>
              <span className="text-white/40 text-xs">Ga mau nuker kamu sama apa pun di dunia ini.</span>
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
            <span className="text-[9px] text-white/30 text-center block font-mono">TAP BUAT ROTASI VIBE</span>
          </Card>

          <Card className="p-5 flex flex-col justify-between min-h-[180px]">
            <span className="text-purple-400 text-[10px] font-mono uppercase tracking-wider">Our Safe Place Hub</span>
            <div className="grid grid-cols-2 gap-2 my-2">
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight * 0.5, behavior: "smooth" })} className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-pink-400 border border-white/5 transition-colors font-mono">📂 Foto Kita</button>
              <button className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-blue-400 border border-white/5 transition-colors font-mono cursor-not-allowed opacity-50">📝 Wishlist</button>
              <button onClick={() => window.scrollTo({ top: document.body.scrollHeight * 0.7, behavior: "smooth" })} className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-green-400 border border-white/5 transition-colors font-mono">🎵 Playlist</button>
              <a href={`https://maps.google.com/?q=${homeLatitude},${homeLongitude}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/[0.02] rounded-lg text-center text-[11px] hover:text-amber-400 border border-white/5 transition-colors font-mono flex items-center justify-center gap-1">📍 {homeLabel}</a>
            </div>
          </Card>
        </div>
      </Section>

      {/* REPOSITORI VISUAL & AUDIO DINAMIS */}
      <Section title="📸 Our Visual Dump & Core Memories">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {photos.map((photo, i) => (
            <Card key={i} className="overflow-hidden bg-white/5 relative group p-1.5">
              <div className="aspect-[4/5] overflow-hidden rounded-xl">
                {photo.url ? (
                  <img src={photo.url} alt={photo.desc} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-white/20">No Image</div>
                )}
              </div>
              <div className="p-2 font-mono flex justify-between items-center text-[10px]">
                <span className="text-white/40">CUTE_0{i+1}</span>
                <span className="text-white/20 truncate max-w-[80px]" title={photo.desc}>{photo.desc || "Tanpa Deskripsi"}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="🎵 Lagu Yang Menggambarkan Kamu">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track, i) => (
            <Card key={i} className={`p-4 flex items-center justify-between group bg-white/[0.02] cursor-pointer ${activeTrack === i ? 'border-pink-500/40 bg-white/[0.04]' : ''}`} onClick={() => setActiveTrack(activeTrack === i ? null : i)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs">
                  {activeTrack === i ? "⏸️" : `0${i+1}`}
                </div>
                <div>
                  <h3 className="font-medium text-xs text-white group-hover:text-pink-400 transition-colors">{track.title || "Unknown Title"}</h3>
                  <p className="text-[11px] text-white/40">{track.artist || "Unknown Artist"}</p>
                </div>
              </div>
              <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: activeTrack === i ? `${trackProgress}%` : "0%" }} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-4 px-6 pb-12">
        <Card className="p-5 bg-white/[0.02] md:col-span-1 cursor-pointer flex flex-col justify-between min-h-[160px]" onClick={() => setIsNoteDecrypted(!isNoteDecrypted)}>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block mb-2">Pesan Rahasia Buat Kamu</span>
            <p className="text-xs font-light text-white/70 leading-relaxed font-mono">
              {isNoteDecrypted ? secretNote : "Ada surat cinta dikunci nih. Klik buat baca..."}
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
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 font-bold whitespace-nowrap">{title}</h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      {children}
    </section>
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
    rotateX.set(-(yCoord / rect.height) * 12); 
    rotateY.set((xCoord / rect.width) * 12);
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
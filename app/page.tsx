"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CORE CONFIG STATE
  // ==========================================
  const [config, setConfig] = useState<any>({
    title_web: "Our Special Place ❤️",
    theme_color: "from-pink-500 to-purple-500",
    music_auto_play: false,
    status_ldr: "± 780 Km Antara Kita",
    pesan_rahasia: "",
    latitude: -6.1751,
    longitude: 106.8272,
    lokasi_utama: "Rumah Kesayangan",
    click_missions: [],
    gacha_pool: [[], []],
    scratch_notes: [],
    quiz_pool: [],
    game_scrambler: [],
    galeri_foto: [],
    audio_tracks: []
  });

  // ADVANCED MUSIC PLAYER STATE (YOUTUBE DECODER)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // INTERACTIVE GAME STATES
  const [clickCounts, setClickCounts] = useState<number[]>([]);
  const [gachaResult, setGachaResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [scratchedIds, setScratchedIds] = useState<number[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // ==========================================
  // FETCH DATA DARI DATABASE SUPABASE
  // ==========================================
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("web_config")
          .select("*")
          .eq("id", 1)
          .single();

        if (data) {
          setConfig(data);
          if (data.click_missions) {
            setClickCounts(new Array(data.click_missions.length).fill(0));
          }
          document.title = data.title_web || "Our Special Place ❤️";
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data halaman depan:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // ==========================================
  // YOUTUBE TRACK URL PARSER
  // ==========================================
  const getYouTubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  // BRIDGE UNTUK MENERIMA DATA TIME DARI YOUTUBE PLAYER
  useEffect(() => {
    const handleYTMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "infoDelivery" && data.info) {
            if (data.info.currentTime !== undefined) setCurrentTime(data.info.currentTime);
            if (data.info.duration !== undefined && data.info.duration > 0) setDuration(data.info.duration);
          }
        } catch (e) {
          // Abaikan pesan non-JSON dari chrome extensions luar
        }
      }
    };

    window.addEventListener("message", handleYTMessage);
    return () => window.removeEventListener("message", handleYTMessage);
  }, []);

  // RESET TIMER SAAT LAGU BERUBAH
  useEffect(() => {
    if (config.audio_tracks && config.audio_tracks.length > 0) {
      setCurrentTime(0);
      setDuration(0);
      if (config.music_auto_play) setIsPlaying(true);
    }
  }, [currentTrackIdx, config.audio_tracks]);

  const sendYTCommand = (command: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: args }),
        "*"
      );
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      sendYTCommand("pauseVideo");
    } else {
      sendYTCommand("playVideo");
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number) => {
    sendYTCommand("seekTo", [value, true]);
    setCurrentTime(value);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ==========================================
  // GAME MANIPULATION INTERACTIONS
  // ==========================================
  const handleMissionClick = (idx: number, target: number, reward: string) => {
    const copy = [...clickCounts];
    if (copy[idx] < target) {
      copy[idx] += 1;
      setClickCounts(copy);
      if (copy[idx] === target) {
        alert(`🎁 Target Terpenuhi! Hadiah: ${reward}`);
      }
    }
  };

  const handleSpinGacha = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setGachaResult("🌀 Mengacak roda takdir kencan...");
    
    setTimeout(() => {
      const allRewards = [...(config.gacha_pool[0] || []), ...(config.gacha_pool[1] || [])];
      if (allRewards.length === 0) {
        setGachaResult("❌ Kolam gacha kosong di database!");
      } else {
        const randomReward = allRewards[Math.floor(Math.random() * allRewards.length)];
        setGachaResult(`🎉 Hasil Spin: ${randomReward}`);
      }
      setIsSpinning(false);
    }, 1300);
  };

  const handleQuizAnswer = (selectedIdx: number, correctIdx: number) => {
    if (selectedIdx === correctIdx) setQuizScore(quizScore + 1);
    if (currentQuizIdx + 1 < config.quiz_pool.length) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03050a] flex flex-col items-center justify-center font-mono text-[11px] text-pink-500 tracking-widest gap-3">
        <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        SINKRONISASI ELEMEN SKENA CORE SYSTEM...
      </div>
    );
  }

  const activeTrack = config.audio_tracks?.[currentTrackIdx];
  const ytVideoId = activeTrack ? getYouTubeId(activeTrack.audioUrl) : "";

  return (
    <div className="min-h-screen bg-[#04060c] text-white font-sans overflow-x-hidden p-4 sm:p-6 pb-28 relative selection:bg-pink-500/30">
      
      {/* BACKGROUND NEON GLOW EFFECTS (3D MOOD) */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[5%] right-[-10%] w-[70vw] h-[70vw] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />

      {/* DETACHED INVISIBLE YOUTUBE PLAYER STREAM */}
      {ytVideoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&autoplay=${config.music_auto_play ? 1 : 0}`}
          className="absolute w-1 h-1 opacity-0 pointer-events-none"
          allow="autoplay"
        />
      )}

      {/* FLOATING ACTION CONTROL BUTTON */}
      <button 
        onClick={() => router.push("/edit")} 
        className="fixed top-4 right-4 z-50 bg-white/[0.03] active:scale-95 border border-white/10 hover:border-pink-500/20 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-mono tracking-widest text-white/80 transition-all"
      >
        ⚙️ PANEL KONTROL
      </button>

      {/* HERO BANNER SECTION */}
      <header className="max-w-md mx-auto text-center pt-8 pb-4 space-y-2 relative z-10">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full text-[10px] font-mono text-pink-400 tracking-wide">
          🛰️ {config.status_ldr}
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-white/90 to-zinc-500 bg-clip-text text-transparent tracking-tight">
          {config.title_web}
        </h1>
      </header>

      <main className="max-w-md mx-auto space-y-6 relative z-10">

        {/* 1. CYBERPUNK 3D VINYL MUSIC PLAYER */}
        {activeTrack && (
          <section className="p-5 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-5">
              {/* Animated 3D Spinning Vinyl Effect */}
              <div className="relative shrink-0">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${config.theme_color || 'from-pink-500 to-purple-500'} p-0.5 shadow-2xl transition-transform ${isPlaying ? 'animate-spin [animation-duration:5s]' : ''}`}>
                  <div className="w-full h-full bg-[#080d1a] rounded-full flex items-center justify-center border-2 border-dashed border-white/20">
                    <div className="w-4 h-4 bg-[#04060c] rounded-full border border-white/10" />
                  </div>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#04060c] animate-pulse" style={{ display: isPlaying ? 'block' : 'none' }} />
              </div>

              {/* Track Info metadata */}
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-pink-400 font-bold tracking-widest uppercase block">// TUNING AUDIO STATIONS</span>
                <h3 className="text-sm font-black text-white truncate tracking-wide mt-0.5">{activeTrack.title || "Untitled Track"}</h3>
                <p className="text-[11px] text-white/40 truncate font-mono">{activeTrack.artist || "Unknown Artist"}</p>
              </div>
            </div>

            {/* REAL-TIME PROGRESS TIMELINE BAR */}
            <div className="mt-5 space-y-1">
              <input 
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none"
              />
              <div className="flex justify-between text-[9px] font-mono text-white/30">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || parseFloat(activeTrack.duration) * 60 || 0)}</span>
              </div>
            </div>

            {/* Controller Engine Play/Pause */}
            <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/[0.03]">
              <span className="text-[9px] font-mono text-white/20">YOUTUBE ENGINE PLAYER</span>
              <div className="flex items-center gap-2">
                {config.audio_tracks.length > 1 && (
                  <button 
                    onClick={() => setCurrentTrackIdx((prev) => (prev + 1) % config.audio_tracks.length)}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center active:scale-90 text-[11px] text-white/50 transition-all"
                  >
                    ⏭️
                  </button>
                )}
                <button 
                  onClick={togglePlay}
                  className="px-5 h-9 rounded-xl bg-white text-black font-black text-xs tracking-widest flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                >
                  {isPlaying ? "⏸️ PAUSE" : "▶️ PLAY NOW"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 2. CORE MEMORIES HORIZONTAL SLIDER */}
        {config.galeri_foto && config.galeri_foto.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[10px] font-bold font-mono text-white/30 px-1 tracking-widest uppercase">// CORE VISUAL MEMORIES</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
              {config.galeri_foto.map((img: any, i: number) => img.url && (
                <div key={i} className="w-[85%] shrink-0 snap-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 shadow-xl">
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-white/5 relative">
                    <img src={img.url} alt="Memories Dump" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <p className="text-[11px] font-medium text-white/70 px-1 truncate">✨ {img.desc || "Our Beautiful Snapshot"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. GAME 1 - LEVEL PROGRESS CLICKER */}
        {config.click_missions && config.click_missions.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-lg">
            <h2 className="text-[10px] font-bold font-mono text-amber-400 tracking-widest uppercase">// MINI ARCADE 01: TAP CLICKS</h2>
            <div className="space-y-2.5">
              {config.click_missions.map((m: any, idx: number) => {
                const current = clickCounts[idx] || 0;
                const percent = Math.min((current / m.target) * 100, 100);
                return (
                  <div key={idx} className="p-3 bg-black/30 border border-white/[0.03] rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white/80">{m.title}</span>
                      <span className="font-mono text-amber-400 font-bold">{current}/{m.target}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                    <button 
                      disabled={current >= m.target}
                      onClick={() => handleMissionClick(idx, m.target, m.reward)}
                      className="w-full py-2 bg-amber-400/10 border border-amber-400/20 active:scale-[0.99] text-amber-400 font-black rounded-lg text-[10px] tracking-widest transition-all disabled:opacity-20"
                    >
                      {current >= m.target ? "✓ TARGET UNLOCKED" : "⚡ SEND CLICK WAVE"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. GAME 2 - SPIN GACHA STATION */}
        <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-lg">
          <h2 className="text-[10px] font-bold font-mono text-blue-400 tracking-widest uppercase">// MINI ARCADE 02: GACHA REWARDS</h2>
          <div className="p-4 bg-black/40 border border-white/[0.03] rounded-xl text-center space-y-3">
            <div className="min-h-[40px] flex items-center justify-center p-2.5 bg-white/[0.01] border border-white/5 rounded-lg">
              <p className="text-xs font-semibold text-white/80 tracking-wide">{gachaResult || "Ketuk tombol spin untuk acak kado/rencana date kalian!"}</p>
            </div>
            <button 
              onClick={handleSpinGacha}
              disabled={isSpinning}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 font-black active:scale-[0.98] rounded-xl text-xs tracking-widest transition-all disabled:opacity-50"
            >
              {isSpinning ? "🎰 ENGINE SPINNING..." : "🎲 SPIN NOW"}
            </button>
          </div>
        </section>

        {/* 5. GAME 3 - COATING GOSOK STATION */}
        {config.scratch_notes && config.scratch_notes.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-lg">
            <h2 className="text-[10px] font-bold font-mono text-fuchsia-400 tracking-widest uppercase">// MINI ARCADE 03: SCRATCH TICKET</h2>
            <div className="space-y-2.5">
              {config.scratch_notes.map((note: string, idx: number) => {
                const isScratched = scratchedIds.includes(idx);
                return (
                  <div key={idx} className="relative overflow-hidden h-12 rounded-xl border border-white/[0.04] bg-black/50 flex items-center justify-center p-3 text-center">
                    <p className="text-xs font-medium text-fuchsia-300 italic font-mono">"{note}"</p>
                    {!isScratched && (
                      <button 
                        onClick={() => setScratchedIds([...scratchedIds, idx])}
                        className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center text-[10px] text-zinc-400 tracking-widest font-mono active:opacity-80 transition-all"
                      >
                        ░░ GOSOK PROTEKSI KUPON ░░
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. GAME 4 - INTERACTIVE RELATION QUIZ */}
        {config.quiz_pool && config.quiz_pool.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-lg">
            <h2 className="text-[10px] font-bold font-mono text-emerald-400 tracking-widest uppercase">// MINI ARCADE 04: RELATIONSHIP QUIZ</h2>
            <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl space-y-3">
              {!quizFinished ? (
                <>
                  <div className="flex justify-between text-[9px] font-mono text-white/30">
                    <span>STAGE QUIZ {currentQuizIdx + 1} OF {config.quiz_pool.length}</span>
                  </div>
                  <p className="text-xs font-bold text-white/90 tracking-wide">{config.quiz_pool[currentQuizIdx]?.q}</p>
                  <div className="space-y-2 pt-1">
                    {config.quiz_pool[currentQuizIdx]?.a?.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizAnswer(optIdx, config.quiz_pool[currentQuizIdx].c)}
                        className="w-full text-left p-2.5 bg-white/[0.02] border border-white/10 active:border-emerald-500 rounded-xl text-xs transition-all text-white/70"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs font-black text-emerald-400 font-mono tracking-widest">✓ QUIZ TERMINATED</p>
                  <p className="text-xs text-white/60">Final Sync Score: <span className="font-mono text-amber-400 font-black">{quizScore}/{config.quiz_pool.length} Correct</span></p>
                  <button onClick={() => { setCurrentQuizIdx(0); setQuizScore(0); setQuizFinished(false); }} className="text-[9px] bg-white/5 border border-white/10 text-white/60 font-mono px-3 py-1 rounded mt-1">REBOOT CORE QUIZ</button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. GAME 5 - LOVE SCRAMBLER WORD PUZZLE */}
        {config.game_scrambler && config.game_scrambler.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-lg">
            <h2 className="text-[10px] font-bold font-mono text-cyan-400 tracking-widest uppercase">// MINI ARCADE 05: WORD SCRAMBLER</h2>
            <div className="space-y-2.5">
              {config.game_scrambler.map((sentence: string, sIdx: number) => {
                const words = sentence.split(",").map(w => w.trim());
                // Susun urutan kata secara acak berdasarkan panjang kata
                const shuffledWords = [...words].sort((a, b) => b.length - a.length);
                return (
                  <div key={sIdx} className="p-3 bg-black/40 border border-white/[0.03] rounded-xl space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {shuffledWords.map((word, wIdx) => (
                        <span key={wIdx} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20 font-mono text-xs select-none">
                          {word}
                        </span>
                      ))}
                    </div>
                    <details className="text-[10px] text-white/20">
                      <summary className="outline-none cursor-pointer hover:text-white/40">Dekripsi Teks Susunan</summary>
                      <p className="mt-1 text-cyan-200/80 font-mono text-xs italic">"{words.join(" ")}"</p>
                    </details>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* LOCKER SURAT CINTA UTAMA & GEOLOCATION SATELLITE */}
        <section className="p-4 bg-gradient-to-b from-pink-900/10 to-transparent border border-pink-500/10 rounded-2xl space-y-3 shadow-lg text-center">
          <h2 className="text-[10px] font-bold font-mono text-pink-400 tracking-widest uppercase">// SECURE ENCRYPTED LOCKER NOTE</h2>
          <div className="p-4 bg-black/50 border border-white/[0.02] rounded-xl text-xs text-white/80 font-mono tracking-wide leading-relaxed whitespace-pre-line shadow-inner">
            {config.pesan_rahasia || "Tidak ada pesan terenkripsi aktif."}
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${config.latitude},${config.longitude}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-white/5 active:scale-95 border border-white/10 rounded-xl text-xs font-mono tracking-widest text-white/90 flex items-center justify-center gap-1.5"
          >
            📍 ACCURACY RADAR LOKASI MAPS
          </a>
        </section>

      </main>

      <footer className="max-w-md mx-auto text-center pt-8 text-[9px] text-white/10 font-mono tracking-widest">
        SECURE APPLICATION NETWORK // SYSTEM OPERATION TERMINATED 2026
      </footer>
    </div>
  );
}
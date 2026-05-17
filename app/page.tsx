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

  // REAL-TIME AUDIO TRACK TRACKING
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

  // LOAD DATABASE SUPABASE
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
        console.error("Gagal memuat data konfigurasi:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // YOUTUBE ID EXTRACTOR
  const getYouTubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  // AUTOMATED LISTENER UNTUK EMIT TIMELINE DARI PLAYER YOUTUBE
  useEffect(() => {
    const handleYTMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          // Sinkronisasi data info API dari pemutar Iframe YouTube
          if (data.event === "infoDelivery" && data.info) {
            if (data.info.currentTime !== undefined) {
              setCurrentTime(data.info.currentTime);
            }
            if (data.info.duration !== undefined && data.info.duration > 0) {
              setDuration(data.info.duration);
            }
          }
          // Fallback durasi jika data awal dimuat browser
          if (data.event === "initialDelivery" && data.info?.duration) {
            setDuration(data.info.duration);
          }
        } catch (e) {
          // Mengabaikan log parsing dari ekstensi eksternal browser
        }
      }
    };

    window.addEventListener("message", handleYTMessage);
    return () => window.removeEventListener("message", handleYTMessage);
  }, []);

  // UPDATE STATE DAN TIMELINE KETIKA PINDAH LAGU
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    if (config.music_auto_play) {
      setIsPlaying(true);
    }
  }, [currentTrackIdx]);

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
    if (!timeInSeconds || isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // GAME LOGIC OPERATIONS
  const handleMissionClick = (idx: number, target: number, reward: string) => {
    const copy = [...clickCounts];
    if (copy[idx] < target) {
      copy[idx] += 1;
      setClickCounts(copy);
      if (copy[idx] === target) alert(`🎁 Target Tercapai! Reward: ${reward}`);
    }
  };

  const handleSpinGacha = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setGachaResult("🌀 Menghitung probabilitas takdir date...");
    setTimeout(() => {
      const allRewards = [...(config.gacha_pool[0] || []), ...(config.gacha_pool[1] || [])];
      if (allRewards.length === 0) {
        setGachaResult("❌ Kolam hadiah kosong, harap isi di panel admin!");
      } else {
        const randomReward = allRewards[Math.floor(Math.random() * allRewards.length)];
        setGachaResult(`🎉 Hasil Gacha: ${randomReward}`);
      }
      setIsSpinning(false);
    }, 1200);
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
      <div className="min-h-screen bg-[#04060b] flex flex-col items-center justify-center font-mono text-xs text-pink-400 tracking-widest gap-2">
        <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        SINKRONISASI ARSITEKTUR MULTI-DEVICE RESPONSIVE...
      </div>
    );
  }

  const activeTrack = config.audio_tracks?.[currentTrackIdx];
  const ytVideoId = activeTrack ? getYouTubeId(activeTrack.audioUrl) : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070a14] via-[#04060c] to-[#020306] text-white overflow-x-hidden selection:bg-pink-500/30 p-4 sm:p-8 lg:p-12 relative">
      
      {/* BACKGROUND GRAPHIC GLOW */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[45vw] h-[45vw] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* INVISIBLE YOUTUBE BACKEND EMBED PLAYER */}
      {ytVideoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&autoplay=${config.music_auto_play ? 1 : 0}&background=1`}
          className="absolute w-1 h-1 opacity-0 pointer-events-none"
          allow="autoplay"
        />
      )}

      {/* FLOATING ACTION OVERLAY BUTTON */}
      <button 
        onClick={() => router.push("/edit")} 
        className="fixed top-4 right-4 z-50 bg-white/5 border border-white/10 hover:border-pink-500/30 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-mono tracking-wider transition-all text-white/80"
      >
        ⚙️ PANEL ADMIN
      </button>

      {/* HEADER HERO AREA */}
      <header className="max-w-5xl mx-auto text-center md:text-left pt-6 pb-6 space-y-2 border-b border-white/[0.05]">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full text-[10px] font-mono tracking-wider text-pink-400">
          📡 Status Sistem: {config.status_ldr}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
          {config.title_web}
        </h1>
      </header>

      {/* RESPONSIVE LAYOUT MATRIX: LAPTOP JADI 2 KOLOM, HP TETAP URUT KE BAWAH */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
        
        {/* KOLOM KIRI (UTAMA: MUSIC PLAYER & MEMORIES PHOTO) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CYBER VINYL MUSIC PLAYER CONTAINER */}
          {activeTrack && (
            <section className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.06] backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-4">
                {/* Vinyl Spin Animation */}
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${config.theme_color || 'from-pink-500 to-purple-500'} p-0.5 shadow-lg ${isPlaying ? 'animate-spin [animation-duration:5s]' : ''}`}>
                    <div className="w-full h-full bg-[#080d1a] rounded-full flex items-center justify-center border-2 border-dashed border-white/20">
                      <div className="w-3 h-3 bg-[#04060c] rounded-full border border-white/10" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-pink-400 font-bold tracking-widest block uppercase">// LIVE DECODER CHANNEL</span>
                  <h3 className="text-sm font-black text-white truncate tracking-wide mt-0.5">{activeTrack.title || "No Title"}</h3>
                  <p className="text-[11px] text-white/40 truncate font-mono">{activeTrack.artist || "Unknown Sync Station"}</p>
                </div>
              </div>

              {/* LIVE TIME TRACKER BAR */}
              <div className="mt-4 space-y-1">
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

              {/* Player Controllers */}
              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/[0.03]">
                {config.audio_tracks.length > 1 && (
                  <button 
                    onClick={() => setCurrentTrackIdx((prev) => (prev + 1) % config.audio_tracks.length)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs text-white/60 active:scale-90 transition-all"
                  >
                    ⏭️
                  </button>
                )}
                <button 
                  onClick={togglePlay}
                  className="px-4 h-8 rounded-lg bg-white text-black font-black text-xs tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-md"
                >
                  {isPlaying ? "⏸️ PAUSE" : "▶️ PLAY"}
                </button>
              </div>
            </section>
          )}

          {/* GALLERY IMAGE MEMORY CONTAINER */}
          {config.galeri_foto && config.galeri_foto.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[10px] font-bold font-mono text-white/30 px-1 tracking-widest uppercase">// CORE SNAPSHOT DUMP</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                {config.galeri_foto.map((img: any, i: number) => img.url && (
                  <div key={i} className="w-[85%] lg:w-full shrink-0 snap-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 shadow-md">
                    <div className="w-full h-40 sm:h-48 lg:h-44 rounded-xl overflow-hidden bg-white/5 relative">
                      <img src={img.url} alt="Memory Snap" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <p className="text-[11px] font-medium text-white/70 px-1 truncate">✨ {img.desc || "Our Memory Snapshot"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* KOLOM KANAN (ARCADE MINI GAME ZONE & ENCRYPTED NOTES) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* GAME 1 - CLICKS ENGINE */}
          {config.click_missions && config.click_missions.length > 0 && (
            <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-md">
              <h2 className="text-[10px] font-bold font-mono text-amber-400 tracking-widest uppercase">🕹️ ARCADE ZONE 01: TAP CLICKS</h2>
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
                        className="w-full py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black rounded-lg text-[10px] tracking-wider transition-all disabled:opacity-20"
                      >
                        {current >= m.target ? "✓ MISSION UNLOCKED" : "⚡ SEND ENERGI TAP"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* GAME 2 - SPIN GACHA */}
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-md">
            <h2 className="text-[10px] font-bold font-mono text-blue-400 tracking-widest uppercase">🎰 ARCADE ZONE 02: SPIN COUNTER</h2>
            <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl text-center space-y-3">
              <div className="min-h-[38px] flex items-center justify-center p-2 bg-white/[0.01] border border-white/5 rounded-lg">
                <p className="text-xs font-semibold text-white/80 tracking-wide">{gachaResult || "Klik spin untuk mengacak takdir rencana date seru!"}</p>
              </div>
              <button 
                onClick={handleSpinGacha}
                disabled={isSpinning}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 font-black rounded-xl text-xs tracking-wider transition-all disabled:opacity-50"
              >
                {isSpinning ? "🎰 ENGINE CYCLING..." : "🎲 SPIN WHEEL"}
              </button>
            </div>
          </section>

          {/* GAME 3 - KUPON GOSOK */}
          {config.scratch_notes && config.scratch_notes.length > 0 && (
            <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-md">
              <h2 className="text-[10px] font-bold font-mono text-fuchsia-400 tracking-widest uppercase">✨ ARCADE ZONE 03: SCRATCH NOTES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.scratch_notes.map((note: string, idx: number) => {
                  const isScratched = scratchedIds.includes(idx);
                  return (
                    <div key={idx} className="relative overflow-hidden h-12 rounded-xl border border-white/[0.04] bg-black/50 flex items-center justify-center p-3 text-center">
                      <p className="text-xs font-medium text-fuchsia-300 font-mono italic">"{note}"</p>
                      {!isScratched && (
                        <button 
                          onClick={() => setScratchedIds([...scratchedIds, idx])}
                          className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-[10px] text-zinc-400 font-mono tracking-wider active:opacity-80 transition-all"
                        >
                          ░░ GOSOK COATING KUPON ░░
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* GAME 4 - HUBUNGAN ROMANTIS QUIZ */}
          {config.quiz_pool && config.quiz_pool.length > 0 && (
            <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-md">
              <h2 className="text-[10px] font-bold font-mono text-emerald-400 tracking-widest uppercase">🧩 ARCADE ZONE 04: CORE RELATION QUIZ</h2>
              <div className="p-3 bg-black/40 border border-white/[0.03] rounded-xl space-y-3">
                {!quizFinished ? (
                  <>
                    <div className="flex justify-between text-[9px] font-mono text-white/30">
                      <span>STAGE {currentQuizIdx + 1} OF {config.quiz_pool.length}</span>
                    </div>
                    <p className="text-xs font-bold text-white/90 tracking-wide">{config.quiz_pool[currentQuizIdx]?.q}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {config.quiz_pool[currentQuizIdx]?.a?.map((opt: string, optIdx: number) => (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizAnswer(optIdx, config.quiz_pool[currentQuizIdx].c)}
                          className="text-left p-2 bg-white/[0.02] border border-white/10 active:border-emerald-500 rounded-lg text-xs transition-all text-white/70 hover:bg-white/5"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-3 space-y-2">
                    <p className="text-xs font-black text-emerald-400 font-mono tracking-widest">✓ QUIZ TERMINATED</p>
                    <p className="text-xs text-white/60">Final Core Score: <span className="font-mono text-amber-400 font-black">{quizScore}/{config.quiz_pool.length} Correct</span></p>
                    <button onClick={() => { setCurrentQuizIdx(0); setQuizScore(0); setQuizFinished(false); }} className="text-[9px] bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded">REBOOT QUIZ STATION</button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* GAME 5 - LOVE SCRAMBLER PUZZLE */}
          {config.game_scrambler && config.game_scrambler.length > 0 && (
            <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-md">
              <h2 className="text-[10px] font-bold font-mono text-cyan-400 tracking-widest uppercase">✍️ ARCADE ZONE 05: WORD SCRAMBLER</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.game_scrambler.map((sentence: string, sIdx: number) => {
                  const words = sentence.split(",").map(w => w.trim());
                  const shuffledWords = [...words].sort((a, b) => b.length - a.length);
                  return (
                    <div key={sIdx} className="p-3 bg-black/40 border border-white/[0.03] rounded-xl space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {shuffledWords.map((word, wIdx) => (
                          <span key={wIdx} className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20 font-mono text-[11px] select-none">
                            {word}
                          </span>
                        ))}
                      </div>
                      <details className="text-[10px] text-white/20">
                        <summary className="outline-none cursor-pointer hover:text-white/40">Dekripsi Susunan</summary>
                        <p className="mt-1 text-cyan-200/80 font-mono text-xs italic">"{words.join(" ")}"</p>
                      </details>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SECRET LOCKER NOTE BOX & GOOGLE MAP TRACKER */}
          <section className="p-4 bg-gradient-to-b from-pink-900/10 to-transparent border border-pink-500/10 rounded-2xl space-y-3 text-center shadow-md">
            <h2 className="text-[10px] font-bold font-mono text-pink-400 tracking-widest uppercase">// SECURE DECRYPTED LOCKER NOTE</h2>
            <div className="p-4 bg-black/50 border border-white/[0.02] rounded-xl text-xs text-white/80 font-mono tracking-wide leading-relaxed whitespace-pre-line shadow-inner">
              {config.pesan_rahasia || "Tidak ada pesan terenkripsi aktif."}
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${config.latitude},${config.longitude}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider text-white/90 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              📍 ACCURACY SATELLITE RADAR MAPS
            </a>
          </section>

        </div>

      </main>

      <footer className="max-w-5xl mx-auto text-center pt-12 text-[9px] text-white/10 font-mono tracking-widest border-t border-white/[0.03] mt-8">
        SECURE SKENA STATION CONNECTED // SYSTEM REBOOT TERMINATED 2026
      </footer>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
    pesan_rahasia: "Loading...",
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

  // INTERACTIVE PLAY STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // GAME STATES
  const [clickCounts, setClickCounts] = useState<number[]>([]);
  const [gachaResult, setGachaResult] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [scratchedIds, setScratchedIds] = useState<number[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // ==========================================
  // FETCH DATA FROM SUPABASE
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
          // Set Title Web secara dinamis di browser
          document.title = data.title_web || "Our Special Place ❤️";
        }
      } catch (err) {
        console.error("Error loading home page database:", err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // AUDIO CORE LOGIC
  useEffect(() => {
    if (config.audio_tracks && config.audio_tracks.length > 0) {
      const activeTrack = config.audio_tracks[currentTrackIdx];
      if (activeTrack && activeTrack.audioUrl) {
        if (audioElement) {
          audioElement.pause();
        }
        const audio = new Audio(activeTrack.audioUrl);
        audio.loop = true;
        setAudioElement(audio);

        if (config.music_auto_play || isPlaying) {
          audio.play().catch(() => console.log("Autoplay blocked by Android Chrome browser policy"));
          setIsPlaying(true);
        }
      }
    }
    return () => {
      if (audioElement) audioElement.pause();
    };
  }, [currentTrackIdx, config.audio_tracks]);

  const togglePlay = () => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch((err) => console.log("Audio play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // GAME ACTIONS
  const handleMissionClick = (idx: number, target: number, reward: string) => {
    const copy = [...clickCounts];
    if (copy[idx] < target) {
      copy[idx] += 1;
      setClickCounts(copy);
      if (copy[idx] === target) {
        alert(`🎁 Target Tercapai! Reward: ${reward}`);
      }
    }
  };

  const handleSpinGacha = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setGachaResult("🌀 Mengacak hadiah kamu...");
    
    setTimeout(() => {
      const allRewards = [...(config.gacha_pool[0] || []), ...(config.gacha_pool[1] || [])];
      if (allRewards.length === 0) {
        setGachaResult("❌ Kolam hadiah kosong, silakan isi di admin!");
      } else {
        const randomReward = allRewards[Math.floor(Math.random() * allRewards.length)];
        setGachaResult(`🎉 Kamu dapet: ${randomReward}`);
      }
      setIsSpinning(false);
    }, 1500);
  };

  const handleQuizAnswer = (selectedIdx: number, correctIdx: number) => {
    if (selectedIdx === correctIdx) {
      setQuizScore(quizScore + 1);
    }
    if (currentQuizIdx + 1 < config.quiz_pool.length) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070c] flex items-center justify-center font-mono text-xs text-pink-400">
        ⚡ MEMUAT SELURUH MEMORI DAN KONTEN INTERAKTIF...
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#070a14] via-[#05070c] to-[#020306] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden p-4 sm:p-6 pb-32`}>
      
      {/* FLOATING ACTION BUTTON ADMIN */}
      <button 
        onClick={() => router.push("/edit")} 
        className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all flex items-center gap-1 text-white/80"
      >
        ⚙️ PANEL ADMIN
      </button>

      {/* HERO SECTION DESIGNED FOR ANDROID SCREEN */}
      <header className="max-w-md mx-auto text-center pt-8 pb-6 space-y-2">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full text-[10px] font-mono tracking-widest text-pink-400 animate-pulse">
          {config.status_ldr}
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent tracking-tight">
          {config.title_web}
        </h1>
        <p className="text-xs text-white/40 font-mono">Verified Connection Status: Secure 🔐</p>
      </header>

      <main className="max-w-md mx-auto space-y-6">

        {/* CORE AUDIO TRACK PLAYER SECTION */}
        {config.audio_tracks && config.audio_tracks.length > 0 && (
          <section className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 backdrop-blur-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${config.theme_color || 'from-pink-500 to-purple-500'} flex items-center justify-center shadow-lg shadow-purple-500/10 flex-shrink-0 ${isPlaying ? 'animate-spin [animation-duration:6s]' : ''}`}>
                🎵
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-white tracking-wide truncate">{config.audio_tracks[currentTrackIdx]?.title || "No Title"}</p>
                <p className="text-[10px] text-white/40 truncate">{config.audio_tracks[currentTrackIdx]?.artist || "Unknown Artist"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {config.audio_tracks.length > 1 && (
                <button 
                  onClick={() => setCurrentTrackIdx((prev) => (prev + 1) % config.audio_tracks.length)}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center active:scale-95 text-xs text-white/60"
                >
                  ⏭️
                </button>
              )}
              <button 
                onClick={togglePlay} 
                className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center active:scale-90 shadow-md transition-all text-xs"
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
            </div>
          </section>
        )}

        {/* GALERI FOTO MEMORY DUMP - HIGHLY RESPONSIVE SLIDER FOR ANDROID COMFORT */}
        {config.galeri_foto && config.galeri_foto.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold font-mono text-white/40 px-1 tracking-wider uppercase">// Core Memories Dump</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory">
              {config.galeri_foto.map((img: any, i: number) => img.url && (
                <div key={i} className="w-[82%] sm:w-[75%] shrink-0 snap-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 relative">
                    <img 
                      src={img.url} 
                      alt="Memory" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                  <p className="text-[11px] font-medium text-white/70 px-1 tracking-wide line-clamp-1">
                    ✨ {img.desc || "Our Beautiful Moment"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GAME 1 - PROGRESS CLICKER */}
        {config.click_missions && config.click_missions.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold font-mono text-amber-400 tracking-wider uppercase">🕹️ Misi Klik Beruntun</h2>
            <div className="space-y-3">
              {config.click_missions.map((m: any, idx: number) => {
                const current = clickCounts[idx] || 0;
                const percent = Math.min((current / m.target) * 100, 100);
                return (
                  <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white/80">{m.title}</span>
                      <span className="font-mono text-amber-300">{current}/{m.target}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                    <button 
                      disabled={current >= m.target}
                      onClick={() => handleMissionClick(idx, m.target, m.reward)}
                      className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] border border-amber-500/20 text-amber-400 font-bold rounded-lg text-[11px] transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {current >= m.target ? "✅ Target Selesai!" : "⚡ Tap Kirim Energi"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* GAME 2 - SPIN GACHA PRIZE POOL */}
        <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold font-mono text-blue-400 tracking-wider uppercase">🎰 Roda Keberuntungan Gacha</h2>
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center space-y-4">
            <div className="min-h-[44px] flex items-center justify-center p-2 bg-white/[0.02] border border-white/5 rounded-lg">
              <p className="text-xs font-bold text-white/80 tracking-wide">{gachaResult || "👉 Tekan spin untuk dapat kejutan date spot/hadiah!"}</p>
            </div>
            <button 
              onClick={handleSpinGacha}
              disabled={isSpinning}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
            >
              {isSpinning ? "🎰 SEDANG BERPUTAR..." : "🎲 SPIN SEKARANG"}
            </button>
          </div>
        </section>

        {/* GAME 3 - KUPON GOSOK DENGAN VERIFIKASI CLICK UNTUK USER ANDROID */}
        {config.scratch_notes && config.scratch_notes.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold font-mono text-fuchsia-400 tracking-wider uppercase">✨ Kupon Gosok Afeksi Hati</h2>
            <div className="grid gap-3 grid-cols-1">
              {config.scratch_notes.map((note: string, idx: number) => {
                const isScratched = scratchedIds.includes(idx);
                return (
                  <div key={idx} className="relative overflow-hidden h-14 rounded-xl border border-white/5 bg-black/60 flex items-center justify-center p-3 text-center">
                    <p className="text-xs font-medium text-fuchsia-200 tracking-wide">{note}</p>
                    {!isScratched && (
                      <button 
                        onClick={() => setScratchedIds([...scratchedIds, idx])}
                        className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 flex items-center justify-center text-[10px] text-white/40 tracking-widest font-mono font-bold uppercase active:opacity-90 transition-all cursor-pointer"
                      >
                        ░░ GOSOK DISINI ░░
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* GAME 4 - ROMANTIC QUIZ SYSTEM */}
        {config.quiz_pool && config.quiz_pool.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold font-mono text-emerald-400 tracking-wider uppercase">🧩 Uji Hubungan Romantis (Kuis)</h2>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-3">
              {!quizFinished ? (
                <>
                  <div className="flex justify-between text-[10px] font-mono text-white/30">
                    <span>PERTANYAAN STAGE {currentQuizIdx + 1} / {config.quiz_pool.length}</span>
                  </div>
                  <p className="text-xs font-bold text-white/90 leading-relaxed">{config.quiz_pool[currentQuizIdx]?.q}</p>
                  <div className="space-y-2 pt-1">
                    {config.quiz_pool[currentQuizIdx]?.a?.map((opt: string, optIdx: number) => (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizAnswer(optIdx, config.quiz_pool[currentQuizIdx].c)}
                        className="w-full text-left p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 active:border-emerald-500 rounded-lg text-xs transition-all text-white/80"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <p className="text-sm font-black text-emerald-400">🎉 Kuis Selesai!</p>
                  <p className="text-xs text-white/70">Skor Akhir Afeksi: <span className="font-mono text-amber-400 font-bold">{quizScore} / {config.quiz_pool.length} Jawaban Benar</span></p>
                  <button 
                    onClick={() => { setCurrentQuizIdx(0); setQuizScore(0); setQuizFinished(false); }}
                    className="mt-2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded"
                  >
                    Ulangi Kuis
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* GAME 5 - LOVE SCRAMBLER WORD PUZZLE */}
        {config.game_scrambler && config.game_scrambler.length > 0 && (
          <section className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold font-mono text-cyan-400 tracking-wider uppercase">✍️ Love Scrambler (Kata Acak)</h2>
            <div className="space-y-2">
              {config.game_scrambler.map((sentence: string, sIdx: number) => {
                const words = sentence.split(",").map(w => w.trim());
                // Acak urutan kata secara konstan untuk tampilan game puzzle
                const shuffledWords = [...words].sort((a, b) => b.localeLength - a.localeLength);
                return (
                  <div key={sIdx} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                    <p className="text-[10px] font-mono text-white/30">PUZZLE DATA 0{sIdx+1}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {shuffledWords.map((word, wIdx) => (
                        <span key={wIdx} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20 font-mono text-xs">
                          {word}
                        </span>
                      ))}
                    </div>
                    <details className="text-[10px] text-white/30 cursor-pointer pt-1">
                      <summary className="hover:text-white/60 outline-none">Lihat Susunan Benar</summary>
                      <p className="mt-1 text-cyan-200 font-medium font-mono text-xs italic">"{words.join(" ")}"</p>
                    </details>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* LOCKER SECRET NOTE SECTION & GOOGLE MAPS PRESISI ACCURACY */}
        <section className="p-4 bg-gradient-to-br from-pink-900/10 to-black/40 border border-pink-500/10 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold font-mono text-pink-400 tracking-wider uppercase">🔒 Surat Cinta & Navigasi Lokasi</h2>
          <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-xs text-white/80 leading-relaxed font-mono whitespace-pre-line text-center">
            {config.pesan_rahasia || "Tidak ada pesan rahasia aktif."}
          </div>
          
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${config.latitude},${config.longitude}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all text-white/90"
          >
            📍 Kunjungi {config.lokasi_utama || "Rumah Kesayangan"} di Google Maps
          </a>
        </section>

      </main>

      {/* FIXED FOOTER CREDITS */}
      <footer className="max-w-md mx-auto text-center pt-8 text-[10px] text-white/20 font-mono tracking-widest">
        MADE WITH HEART FOR OUR CORE CONNECTION &copy; 2026
      </footer>
    </div>
  );
}
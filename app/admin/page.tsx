"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase"; // Pastikan path impor client Supabase kamu sudah benar

export default function EditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ==========================================
  // STATE MASTER DATA (TERKONEKSI SUPABASE)
  // ==========================================
  
  // 1. Data Umum, Jarak LDR, & Koordinat Rumah Presisi
  const [customLdr, setCustomLdr] = useState("± 780 Km Antara Kita");
  const [secretNote, setSecretNote] = useState("Makasih banyak ya udah selalu sabar, chill, dan jadi safe place paling nyaman buat aku. I love you! ❤️");
  const [homeLatitude, setHomeLatitude] = useState("-6.1751"); 
  const [homeLongitude, setHomeLongitude] = useState("106.8272");
  const [homeLabel, setHomeLabel] = useState("Rumah Kesayangan");

  // 2. Game 1: Clicker Tantangan
  const [clickMissions, setClickMissions] = useState<any[]>([]);

  // 3. Game 2: Pilihan Gacha (Input string dikonversi ke Array JSONB)
  const [gachaPool0Input, setGachaPool0Input] = useState("");
  const [gachaPool1Input, setGachaPool1Input] = useState("");

  // 4. Game 3: Kupon Gosok Afeksi
  const [scratchNotes, setScratchNotes] = useState<string[]>([]);

  // 5. Game 4: Kuis Bertingkat
  const [quizPool, setQuizPool] = useState<any[]>([]);

  // 6. Game 5: Word Puzzle (Susun Kata)
  const [puzzleInput, setPuzzleInput] = useState<string[]>([]);

  // 7. Repositori Foto Dump
  const [photos, setPhotos] = useState<any[]>([]);

  // 8. Playlist Audio Musik
  const [tracks, setTracks] = useState<any[]>([]);

  // ==========================================
  // FITUR AMBIL DATA UTAMA DARI SUPABASE CLOUD
  // ==========================================
  useEffect(() => {
    const fetchCurrentConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("web_config")
          .select("*")
          .single(); // Mengambil satu baris konfigurasi aktif

        if (error) throw error;

        if (data) {
          if (data.status_ldr) setCustomLdr(data.status_ldr);
          if (data.pesan_rahasia) setSecretNote(data.pesan_rahasia);
          if (data.latitude) setHomeLatitude(String(data.latitude));
          if (data.longitude) setHomeLongitude(String(data.longitude));
          if (data.lokasi_utama) setHomeLabel(data.lokasi_utama);
          
          if (data.click_missions) setClickMissions(data.click_missions);
          if (data.scratch_notes) setScratchNotes(data.scratch_notes);
          if (data.quiz_pool) setQuizPool(data.quiz_pool);
          if (data.galeri_foto) setPhotos(data.galeri_foto);
          if (data.audio_tracks) setTracks(data.audio_tracks);

          // Rekonstruksi Gacha Pool (Array of Array) ke Input Teks Editor
          if (data.gacha_pool && data.gacha_pool.length >= 2) {
            setGachaPool0Input(data.gacha_pool[0].join(", "));
            setGachaPool1Input(data.gacha_pool[1].join(", "));
          }

          // Rekonstruksi Game Word Scrambler
          if (data.game_scrambler) {
            setPuzzleInput(data.game_scrambler);
          }
        }
      } catch (err) {
        console.error("Gagal memuat konfigurasi dari Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentConfig();
  }, []);

  // ==========================================
  // FUNGSI MANIPULASI DATA LOKAL EDITOR
  // ==========================================

  // Game 1: Clicker
  const handleAddClick = () => setClickMissions([...clickMissions, { title: "Misi Klik Baru", target: 10, reward: "Hadiah Kejutan Baru", color: "from-pink-500 to-purple-500" }]);
  const handleUpdateClick = (i: number, key: string, val: any) => {
    const copy = [...clickMissions];
    copy[i] = { ...copy[i], [key]: val };
    setClickMissions(copy);
  };

  // Game 4: Kuis
  const handleAddQuiz = () => setQuizPool([...quizPool, { q: "Pertanyaan Baru?", a: ["Pilihan 1", "Pilihan 2", "Pilihan 3"], c: 0 }]);
  const handleUpdateQuiz = (i: number, key: string, val: any) => {
    const copy = [...quizPool];
    copy[i] = { ...copy[i], [key]: val };
    setQuizPool(copy);
  };
  const handleUpdateQuizOpt = (quizIdx: number, optIdx: number, val: string) => {
    const copy = [...quizPool];
    const updatedAnswers = [...copy[quizIdx].a];
    updatedAnswers[optIdx] = val;
    copy[quizIdx] = { ...copy[quizIdx], a: updatedAnswers };
    setQuizPool(copy);
  };

  // Foto & Musik
  const handleUpdatePhoto = (i: number, key: "url" | "desc", val: string) => {
    const copy = [...photos];
    copy[i] = { ...copy[i], [key]: val };
    setPhotos(copy);
  };
  const handleUpdateTrack = (i: number, key: "title" | "artist" | "duration" | "audioUrl", val: string) => {
    const copy = [...tracks];
    copy[i] = { ...copy[i], [key]: val };
    setTracks(copy);
  };

  // ==========================================
  // SIMPAN SEMUA DATA KE SUPABASE CLOUD
  // ==========================================
  const handleSaveAll = async () => {
    try {
      // Parsing string gacha kembali menjadi array terstruktur
      const pool0Array = gachaPool0Input.split(",").map(item => item.trim()).filter(Boolean);
      const pool1Array = gachaPool1Input.split(",").map(item => item.trim()).filter(Boolean);
      const structuredGachaPool = [pool0Array, pool1Array];

      // Ambil ID baris pertama atau lakukan upsert terpusat pada baris utama database
      const { error } = await supabase
        .from("web_config")
        .upsert({
          id: 1, // ID Konfigurasi Tetap
          status_ldr: customLdr,
          pesan_rahasia: secretNote,
          latitude: parseFloat(homeLatitude) || 0,
          longitude: parseFloat(homeLongitude) || 0,
          lokasi_utama: homeLabel,
          click_missions: clickMissions,
          gacha_pool: structuredGachaPool,
          scratch_notes: scratchNotes,
          quiz_pool: quizPool,
          game_scrambler: puzzleInput,
          galeri_foto: photos,
          audio_tracks: tracks,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert("✨ Cloud Sync Sukses! Semua data interaktif, arsitektur game, & musik telah disimpan di Supabase.");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert(`❌ Gagal menyimpan data ke database: ${err.message || err}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070c] flex items-center justify-center font-mono text-xs text-white/40">
        MENGAMBIL TELEMETRI CONFIG DARI SUPABASE...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070c] text-white p-6 pb-20 font-sans selection:bg-pink-500/20">
      
      {/* HEADER CONTROL */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <span className="text-xs font-mono text-pink-400 tracking-widest">// SETTING PUSAT DATABASE CLOUD</span>
          <h1 className="text-2xl font-black tracking-tight mt-1">Skena Customizer & Editor Interaktif</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-all">Batal</button>
          <button onClick={handleSaveAll} className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 rounded-xl text-xs font-bold shadow-lg transition-all">💾 Simpan Permanen</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">

        {/* 1. KONTROL DATA STATUS & KOORDINAT RUMAH PRESISI */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-pink-400">📍 Status Umum & Lokasi Maps Presisi</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/40 block mb-1">Status Teks Hari / Jarak LDR</label>
              <input type="text" value={customLdr} onChange={(e) => setCustomLdr(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/40 block mb-1">Label Lokasi Utama</label>
              <input type="text" value={homeLabel} onChange={(e) => setHomeLabel(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs" placeholder="Misal: Rumah Kesayangan" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/40 block mb-1">Garis Lintang Rumah (Latitude)</label>
              <input type="text" value={homeLatitude} onChange={(e) => setHomeLatitude(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-emerald-400" placeholder="-6.1751" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/40 block mb-1">Garis Bujur Rumah (Longitude)</label>
              <input type="text" value={homeLongitude} onChange={(e) => setHomeLongitude(e.target.value)} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-emerald-400" placeholder="106.8272" />
            </div>
          </div>
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[11px] text-white/40">
            💡 <span className="text-white/70 font-semibold">Info Link:</span> Sistem depan akan otomatis mengarahkan ke Google Maps dengan presisi tinggi berdasarkan titik koordinat: <a href={`http://googleusercontent.com/maps.google.com/${homeLatitude},${homeLongitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-mono">{homeLatitude}, {homeLongitude}</a>
          </div>
        </section>

        {/* 2. AUDIO & PLAYLIST MUSIK */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-purple-400">🎵 Audio Core Soundtrack (Bisa Putar Lagu)</h2>
            <button onClick={() => setTracks([...tracks, { title: "", artist: "", duration: "03:00", audioUrl: "" }])} className="text-[11px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">+ Tambah File Musik</button>
          </div>
          <div className="space-y-3">
            {tracks.map((t, i) => (
              <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-[10px] text-white/30"><span>TRACK AUDIO 0{i+1}</span><button onClick={() => setTracks(tracks.filter((_, idx) => idx !== i))} className="text-red-400">Hapus Musik</button></div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input type="text" value={t.title || ""} onChange={(e) => handleUpdateTrack(i, "title", e.target.value)} placeholder="Judul Lagu" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={t.artist || ""} onChange={(e) => handleUpdateTrack(i, "artist", e.target.value)} placeholder="Penyanyi / Artis" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={t.duration || ""} onChange={(e) => handleUpdateTrack(i, "duration", e.target.value)} placeholder="Durasi Teks (Menit:Detik)" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-0.5">Link Direct File Audio (.mp3)</label>
                  <input type="text" value={t.audioUrl || ""} onChange={(e) => handleUpdateTrack(i, "audioUrl", e.target.value)} placeholder="https://domain.com/lagu-kamu.mp3" className="w-full p-2 bg-white/5 rounded border border-white/10 font-mono text-purple-300" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. GAME 1 - CLICKER */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-amber-400">🕹️ Game 1: Misi Klik Beruntun (Clicker)</h2>
            <button onClick={handleAddClick} className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">+ Tambah Tantangan</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {clickMissions.map((m, i) => (
              <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-[10px] text-white/30"><span>LEVEL MISI 0{i+1}</span><button onClick={() => setClickMissions(clickMissions.filter((_, idx) => idx !== i))} className="text-red-400">Hapus</button></div>
                <input type="text" value={m.title || ""} onChange={(e) => handleUpdateClick(i, "title", e.target.value)} placeholder="Judul misi/tantangan" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={m.target || 0} onChange={(e) => handleUpdateClick(i, "target", parseInt(e.target.value) || 0)} placeholder="Target Klik" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={m.reward || ""} onChange={(e) => handleUpdateClick(i, "reward", e.target.value)} placeholder="Reward/Hadiah Teks" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. GAME 2 - GACHA ITEMS */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-blue-400">🎰 Game 2: Kolam Hadiah Spin Gacha</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
              <span className="text-[11px] text-blue-400 font-mono block">GACHA TIER 1 (Pisahkan dengan Koma)</span>
              <input type="text" value={gachaPool0Input} onChange={(e) => setGachaPool0Input(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-xs font-mono" />
            </div>
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1">
              <span className="text-[11px] text-blue-400 font-mono block">GACHA TIER 2 (Pisahkan dengan Koma)</span>
              <input type="text" value={gachaPool1Input} onChange={(e) => setGachaPool1Input(e.target.value)} className="w-full p-2 bg-white/5 border border-white/10 rounded text-xs font-mono" />
            </div>
          </div>
        </section>

        {/* GAME 3 - KUPON GOSOK AFEKSI */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-purple-400">✨ Game 3: Kupon Gosok Afeksi (Teks Acak)</h2>
            <button onClick={() => setScratchNotes([...scratchNotes, "Teks kupon baru disini..."])} className="text-[11px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">+ Tambah Kupon</button>
          </div>
          <div className="space-y-2">
            {scratchNotes.map((note, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-white/30 font-mono">0{i+1}</span>
                <input type="text" value={note} onChange={(e) => {
                  const copy = [...scratchNotes];
                  copy[i] = e.target.value;
                  setScratchNotes(copy);
                }} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs" />
                <button onClick={() => setScratchNotes(scratchNotes.filter((_, idx) => idx !== i))} className="text-xs text-red-400 px-2">Hapus</button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GAME 4 - KUIS BERTINGKAT */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-emerald-400">🧩 Game 4: Kuis Pengetahuan Romantis</h2>
            <button onClick={handleAddQuiz} className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">+ Tambah Soal Kuis</button>
          </div>
          <div className="space-y-4">
            {quizPool.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center"><span className="font-mono text-emerald-400">PERTANYAAN STAGE {qIdx+1}</span><button onClick={() => setQuizPool(quizPool.filter((_, idx) => idx !== qIdx))} className="text-red-400">Hapus Soal</button></div>
                <input type="text" value={q.q || ""} onChange={(e) => handleUpdateQuiz(qIdx, "q", e.target.value)} placeholder="Teks Pertanyaan" className="w-full p-2 bg-white/5 border border-white/10 rounded text-xs font-semibold" />
                <div className="grid gap-2 sm:grid-cols-3">
                  {q.a?.map((opt: string, optIdx: number) => (
                    <div key={optIdx} className="space-y-1">
                      <label className="text-[10px] text-white/30">Pilihan {optIdx+1}</label>
                      <input type="text" value={opt || ""} onChange={(e) => handleUpdateQuizOpt(qIdx, optIdx, e.target.value)} className="w-full p-1.5 bg-white/5 border border-white/10 rounded" />
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <label className="text-[10px] text-amber-400 block mb-1">Index Pilihan Benar (Isi 0 untuk Pilihan 1, Isi 1 untuk Pilihan 2, Isi 2 untuk Pilihan 3)</label>
                  <input type="number" min={0} max={2} value={q.c ?? 0} onChange={(e) => handleUpdateQuiz(qIdx, "c", parseInt(e.target.value) || 0)} className="w-16 p-1 bg-white/10 border border-white/20 rounded font-mono text-center" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. GAME 5 - SUSUN KATA (PUZZLE) */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-cyan-400">✍️ Game 5: Love Scrambler (Susun Rangkaian Kata)</h2>
            <button onClick={() => setPuzzleInput([...puzzleInput, "Kita, Selamanya, Bersama"])} className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">+ Tambah Kalimat Baru</button>
          </div>
          <p className="text-[11px] text-white/30 leading-none">*Format wajib dipisah tanda koma tanpa spasi agar mesin pengacak bekerja sempurna.</p>
          <div className="space-y-2">
            {puzzleInput.map((sentence, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-white/30 font-mono">0{i+1}</span>
                <input type="text" value={sentence} onChange={(e) => {
                  const copy = [...puzzleInput];
                  copy[i] = e.target.value;
                  setPuzzleInput(copy);
                }} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-cyan-300" />
                <button onClick={() => setPuzzleInput(puzzleInput.filter((_, idx) => idx !== i))} className="text-xs text-red-400 px-2">Hapus</button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. KONTROL FOTO MEMORI DUMP */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">📸 Galeri Foto Dump & Core Memories</h2>
            <button onClick={() => setPhotos([...photos, { url: "", desc: "" }])} className="text-[10px] text-white/50 border border-white/20 px-2 py-0.5 rounded">+ Tambah Slot Foto</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((p, i) => (
              <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-1.5 text-xs">
                <input type="text" value={p.url || ""} onChange={(e) => handleUpdatePhoto(i, "url", e.target.value)} placeholder="Link URL Gambar Unsplash / Pin" className="w-full p-1.5 bg-white/5 rounded text-[11px] font-mono text-white/60" />
                <input type="text" value={p.desc || ""} onChange={(e) => handleUpdatePhoto(i, "desc", e.target.value)} placeholder="Keterangan Kenangan Foto Ini" className="w-full p-1.5 bg-white/5 rounded text-[11px]" />
                <button onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="text-[10px] text-red-400 block pt-0.5">Hapus Slot Gambar</button>
              </div>
            ))}
          </div>
        </section>

        {/* SURAT CINTA UTAMA */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-pink-400 block">🔒 Pesan Rahasia Terenkripsi Utama (Locker Note)</label>
          <textarea value={secretNote} onChange={(e) => setSecretNote(e.target.value)} rows={3} className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white/80 focus:outline-none font-mono resize-none leading-relaxed" placeholder="Tulis ungkapan perasaan hati kalian di sini..." />
        </section>

      </div>
    </main>
  );
}
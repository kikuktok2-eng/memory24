"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPage() {
  const router = useRouter();

  // ==========================================
  // STATE MASTER DATA (SEMUA BISA DIEDIT)
  // ==========================================
  
  // 1. Data Umum, Jarak LDR, & Koordinat Rumah Presisi
  const [customLdr, setCustomLdr] = useState("± 780 Km Antara Kita");
  const [secretNote, setSecretNote] = useState("Makasih banyak ya udah selalu sabar, chill, dan jadi safe place paling nyaman buat aku. I love you! ❤️");
  const [homeLatitude, setHomeLatitude] = useState("-6.1751"); 
  const [homeLongitude, setHomeLongitude] = useState("106.8272");
  const [homeLabel, setHomeLabel] = useState("Rumah Kesayangan");

  // 2. Game 1: Clicker Tantangan
  const [clickMissions, setClickMissions] = useState([
    { title: "Kirim Energi Kangen Brutal", target: 10, reward: "🔋 Sinyal Kangen Terkirim!", color: "from-pink-500 to-purple-500" },
    { title: "Nabung Peluk Online", target: 15, reward: "🤗 Slot Peluk Ditambahkan!", color: "from-purple-500 to-indigo-500" }
  ]);

  // 3. Game 2: Pilihan Gacha (Menggunakan string agar input lancar diketik)
  const [gachaPool0Input, setGachaPool0Input] = useState("💔 Zonk,❤️ Bonus Pap Cantik,💔 Kosong");
  const [gachaPool1Input, setGachaPool1Input] = useState("💔 Coba Lagi,🍿 Ditraktir Seblak Next Date,💔 Kurang Beruntung");

  // 4. Game 3: Kupon Gosok Afeksi
  const [scratchNotes, setScratchNotes] = useState([
    "Hari ini kamu cakep banget, jangan lupa makan ya sayang! 🥰",
    "Semesta itu luas, tapi buat aku pusatnya tetep di kamu. 🌌"
  ]);

  // 5. Game 4: Kuis Bertingkat
  const [quizPool, setQuizPool] = useState([
    { q: "Mana date spot yang paling core kita banget?", a: ["Ngopi Senja", "MCD 24 Jam", "Deep Talk Motoran"], c: 2 }
  ]);

  // 6. Game 5: Word Puzzle (Susun Kata)
  const [puzzleSentences, setPuzzleSentences] = useState([
    "Kamu,Adalah,Semesta,Paling,Indah",
    "Mau,Bareng,Kamu,Sampai,Tua"
  ]);

  // 7. Repositori Foto Dump
  const [photos, setPhotos] = useState([
    { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", desc: "Waktu Cari Senja" }
  ]);

  // 8. Playlist Audio Musik
  const [tracks, setTracks] = useState([
    { title: "Lover", artist: "Taylor Swift", duration: "03:41", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
  ]);

  // ==========================================
  // FITUR AMBIL DATA UTAMA DARI LOCAL STORAGE
  // ==========================================
  useEffect(() => {
    const savedLdr = localStorage.getItem("our_ldr");
    const savedNote = localStorage.getItem("our_note");
    const savedLat = localStorage.getItem("home_lat");
    const savedLng = localStorage.getItem("home_lng");
    const savedLabel = localStorage.getItem("home_label");

    if (savedLdr) setCustomLdr(savedLdr);
    if (savedNote) setSecretNote(savedNote);
    if (savedLat) setHomeLatitude(savedLat);
    if (savedLng) setHomeLongitude(savedLng);
    if (savedLabel) setHomeLabel(savedLabel);

    const loadFromStorage = (key: string, setter: Function) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
    };

    loadFromStorage("click_missions", setClickMissions);
    loadFromStorage("scratch_notes", setScratchNotes);
    loadFromStorage("quiz_pool", setQuizPool);
    loadFromStorage("puzzle_sentences", setPuzzleSentences);
    loadFromStorage("our_photos", setPhotos);
    loadFromStorage("our_tracks", setTracks);

    // Load khusus Gacha Pool agar disinkronkan ke string input
    const savedGacha0 = localStorage.getItem("gacha_pool_0");
    if (savedGacha0) setGachaPool0Input(JSON.parse(savedGacha0).join(","));
    
    const savedGacha1 = localStorage.getItem("gacha_pool_1");
    if (savedGacha1) setGachaPool1Input(JSON.parse(savedGacha1).join(","));
  }, []);

  // ==========================================
  // FUNGSI MANIPULASI DATA
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
  // SIMPAN SEMUA DATA KE LOCAL STORAGE
  // ==========================================
  const handleSaveAll = () => {
    // Memproses data input string gacha menjadi array kembali saat disimpan
    const pool0Array = gachaPool0Input.split(",").map(item => item.trim());
    const pool1Array = gachaPool1Input.split(",").map(item => item.trim());

    localStorage.setItem("our_ldr", customLdr);
    localStorage.setItem("our_note", secretNote);
    localStorage.setItem("home_lat", homeLatitude);
    localStorage.setItem("home_lng", homeLongitude);
    localStorage.setItem("home_label", homeLabel);
    localStorage.setItem("click_missions", JSON.stringify(clickMissions));
    localStorage.setItem("gacha_pool_0", JSON.stringify(pool0Array));
    localStorage.setItem("gacha_pool_1", JSON.stringify(pool1Array));
    localStorage.setItem("scratch_notes", JSON.stringify(scratchNotes));
    localStorage.setItem("quiz_pool", JSON.stringify(quizPool));
    localStorage.setItem("puzzle_sentences", JSON.stringify(puzzleSentences));
    localStorage.setItem("our_photos", JSON.stringify(photos));
    localStorage.setItem("our_tracks", JSON.stringify(tracks));

    alert("✨ Sukses! Semua data interaktif, musik, & lokasi presisi disimpan lewat Local Storage.");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#05070c] text-white p-6 pb-20 font-sans selection:bg-pink-500/20">
      
      {/* HEADER CONTROL */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <span className="text-xs font-mono text-pink-400 tracking-widest">// SETTING PUSAT SISTEM</span>
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
            💡 <span className="text-white/70 font-semibold">Info Link:</span> Sistem depan akan otomatis mengarahkan ke Google Maps dengan presisi tinggi berdasarkan titik koordinat: <a href={`https://www.google.com/maps/search/?api=1&query=${homeLatitude},${homeLongitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-mono">{homeLatitude}, {homeLongitude}</a>
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
                  <input type="text" value={t.title} onChange={(e) => handleUpdateTrack(i, "title", e.target.value)} placeholder="Judul Lagu" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={t.artist} onChange={(e) => handleUpdateTrack(i, "artist", e.target.value)} placeholder="Penyanyi / Artis" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={t.duration} onChange={(e) => handleUpdateTrack(i, "duration", e.target.value)} placeholder="Durasi Teks (Menit:Detik)" className="w-full p-2 bg-white/5 rounded border border-white/10" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-0.5">Link Direct File Audio (.mp3)</label>
                  <input type="text" value={t.audioUrl} onChange={(e) => handleUpdateTrack(i, "audioUrl", e.target.value)} placeholder="https://domain.com/lagu-kamu.mp3" className="w-full p-2 bg-white/5 rounded border border-white/10 font-mono text-purple-300" />
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
                <input type="text" value={m.title} onChange={(e) => handleUpdateClick(i, "title", e.target.value)} placeholder="Judul misi/tantangan" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={m.target} onChange={(e) => handleUpdateClick(i, "target", parseInt(e.target.value) || 0)} placeholder="Target Klik" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
                  <input type="text" value={m.reward} onChange={(e) => handleUpdateClick(i, "reward", e.target.value)} placeholder="Reward/Hadiah Teks" className="w-full p-1.5 bg-white/5 rounded border border-white/10" />
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
                <input type="text" value={q.q} onChange={(e) => handleUpdateQuiz(qIdx, "q", e.target.value)} placeholder="Teks Pertanyaan" className="w-full p-2 bg-white/5 border border-white/10 rounded text-xs font-semibold" />
                <div className="grid gap-2 sm:grid-cols-3">
                  {q.a.map((opt, optIdx) => (
                    <div key={optIdx} className="space-y-1">
                      <label className="text-[10px] text-white/30">Pilihan {optIdx+1}</label>
                      <input type="text" value={opt} onChange={(e) => handleUpdateQuizOpt(qIdx, optIdx, e.target.value)} className="w-full p-1.5 bg-white/5 border border-white/10 rounded" />
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <label className="text-[10px] text-amber-400 block mb-1">Index Pilihan Benar (Isi 0 untuk Pilihan 1, Isi 1 untuk Pilihan 2, Isi 2 untuk Pilihan 3)</label>
                  <input type="number" min={0} max={2} value={q.c} onChange={(e) => handleUpdateQuiz(qIdx, "c", parseInt(e.target.value) || 0)} className="w-16 p-1 bg-white/10 border border-white/20 rounded font-mono text-center" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. GAME 5 - SUSUN KATA (PUZZLE) */}
        <section className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-cyan-400">✍️ Game 5: Love Scrambler (Susun Rangkaian Kata)</h2>
            <button onClick={() => setPuzzleSentences([...puzzleSentences, "Kita,Selamanya,Bersama"])} className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">+ Tambah Kalimat Baru</button>
          </div>
          <p className="text-[11px] text-white/30 leading-none">*Format wajib dipisah tanda koma tanpa spasi agar mesin pengacak bekerja sempurna.</p>
          <div className="space-y-2">
            {puzzleSentences.map((sentence, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs text-white/30 font-mono">0{i+1}</span>
                <input type="text" value={sentence} onChange={(e) => {
                  const copy = [...puzzleSentences];
                  copy[i] = e.target.value;
                  setPuzzleSentences(copy);
                }} className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-cyan-300" />
                <button onClick={() => setPuzzleSentences(puzzleSentences.filter((_, idx) => idx !== i))} className="text-xs text-red-400 px-2">Hapus</button>
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
                <input type="text" value={p.url} onChange={(e) => handleUpdatePhoto(i, "url", e.target.value)} placeholder="Link URL Gambar Unsplash / Pin" className="w-full p-1.5 bg-white/5 rounded text-[11px] font-mono text-white/60" />
                <input type="text" value={p.desc} onChange={(e) => handleUpdatePhoto(i, "desc", e.target.value)} placeholder="Keterangan Kenangan Foto Ini" className="w-full p-1.5 bg-white/5 rounded text-[11px]" />
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
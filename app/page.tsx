"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    // Hitung hari sejak awal 2024 (Misal: 1 Januari 2024)
    const startDate = new Date("2024-01-01");
    const today = new Date();
    const difference = today.getTime() - startDate.getTime();
    setDaysTogether(Math.floor(difference / (1000 * 60 * 60 * 24)));

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#05070c] text-white relative overflow-hidden font-sans selection:bg-pink-500/30">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/10 to-transparent blur-[150px] -top-96 -left-96 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-[130px] top-1/2 -right-80 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/5 to-transparent blur-[160px] -bottom-96 left-1/3 pointer-events-none" />

      {/* HERO SECTION WITH 3D TEXT EFFECT */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Our Universe
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            Our Memory Space
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">
            A secure digital archive for our visual diary, favorite soundtracks, and untold love stories.
          </p>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll Down</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* COUNTER & STATUS (3D GLOW CARD) */}
      <Section title="The Journey">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 flex flex-col justify-between p-6 bg-gradient-to-br from-white/[0.07] to-transparent">
            <span className="text-white/40 text-xs uppercase tracking-wider">Days of Togetherness</span>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                {daysTogether}+
              </span>
              <span className="text-white/60 text-sm">Days and counting</span>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/[0.03]">
            <span className="text-white/40 text-xs uppercase tracking-wider">Current Status</span>
            <div className="mt-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-pink-500/10 border border-pink-500/30 text-pink-400">
                ❤️ In a Love Story
              </span>
              <p className="text-xl font-medium mt-3">Since Year 2024</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* TRENDY PHOTO GALLERY GRID (PINTEREST STYLE) */}
      <Section title="Visual Archive">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {[
            { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600", desc: "Under the golden sky" },
            { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600", desc: "Cozy warm coffee dates" },
            { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600", desc: "Strolling around town" },
            { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600", desc: "Night lights & deep talks" },
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600", desc: "Beach sunset breeze" },
          ].map((photo, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 relative group cursor-pointer shadow-xl"
            >
              <img 
                src={photo.url} 
                alt={photo.desc} 
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-xs font-light text-white/70">Memory #{i+1}</p>
                <p className="text-sm font-medium text-white">{photo.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* TASTEFUL MUSIC WIDGET */}
      <Section title="Our Soundtrack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Lover", artist: "Taylor Swift", duration: "3:41" },
            { title: "About You", artist: "The 1975", duration: "5:26" },
            { title: "Best Friend", artist: "Rex Orange County", duration: "4:21" },
          ].map((track, i) => (
            <Card key={i} className="p-4 flex items-center justify-between group bg-white/[0.03] hover:border-pink-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">🎵</span>
                  {/* Fake wave animation on hover */}
                  <div className="absolute bottom-1 left-0 right-0 h-1 flex justify-center gap-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-[2px] h-2 bg-pink-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-[2px] h-3 bg-pink-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <div className="w-[2px] h-1 bg-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-white group-hover:text-pink-400 transition-colors">{track.title}</h3>
                  <p className="text-xs text-white/40">{track.artist}</p>
                </div>
              </div>
              
              {/* Audio progress mock */}
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-[10px] text-white/30">{track.duration}</span>
                <div className="w-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-pink-500 group-hover:w-full transition-all duration-1000" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* STORY & INTERACTIVE QUOTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-4 px-6 pb-16">
        <Card className="p-6 bg-white/[0.02]">
          <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block mb-2">Our Story</span>
          <p className="text-sm font-light text-white/70 leading-relaxed">
            Some moments aren’t meant to be shared with the entire world. They stay right here—quiet, meaningful, and deeply personal.
          </p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-500/[0.05] to-transparent flex flex-col justify-center items-center text-center">
          <p className="text-base italic font-serif text-white/90">
            “We didn’t plan it, but we stayed.”
          </p>
          <div className="w-6 h-[1px] bg-white/20 my-3" />
          <span className="text-[10px] uppercase tracking-widest text-white/30">Safe Space</span>
        </Card>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-white/20 text-[11px] tracking-widest py-12 border-t border-white/[0.02] bg-black/20">
        MADE WITH MEMORIES & SIMPLICITY — © {new Date().getFullYear()}
      </footer>

    </main>
  );
}

/* HIGHLY SCANNAble & ANIMATED SECTION CONTAINER */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 py-14"
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

/* ADVANCED 3D NEUMORPHIC/GLASS CARD COMPONENT */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, boxShadow: "0px 20px 40px rgba(244, 63, 94, 0.04)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md
        transition-all duration-300 ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "./components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#070A12] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-pink-500/10 blur-[180px] top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[160px] bottom-[-200px] right-[-200px]" />

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-semibold"
        >
          Our Memory Space
        </motion.h1>

        <p className="text-white/50 mt-4 text-sm max-w-md">
          A quiet place for memories, music, and stories.
        </p>

      </section>

      {/* STATUS */}
      <Section title="Relationship Status">
        <Card>
          <span className="text-pink-400 font-semibold">
            In a Quiet Love Story
          </span>
          <p className="text-white/50 text-xs mt-1">
            Since 2024
          </p>
        </Card>
      </Section>

      {/* MUSIC */}
      <Section title="Favorite Music">
        {["Lover - Taylor Swift", "About You - The 1975", "Best Friend - Rex Orange County"].map((m, i) => (
          <Card key={i} hover>
            🎵 {m}
          </Card>
        ))}
      </Section>

      {/* PLACES */}
      <Section title="Places We’ve Been">
        {["Sunset Beach", "Night Coffee Shop", "City Walk"].map((p, i) => (
          <Card key={i} hover>
            📍 {p}
          </Card>
        ))}
      </Section>

      {/* STORY */}
      <Section title="Story">
        <Card>
          Some memories are private, but meaningful.
        </Card>
      </Section>

      {/* QUOTE */}
      <Section title="Quote">
        <Card center>
          “We didn’t plan it, but we stayed.”
        </Card>
      </Section>

      {/* FOOTER */}
      <p className="text-center text-white/30 text-xs py-10">
        made with memories & simplicity
      </p>

    </main>
  );
}

/* SECTION */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="max-w-3xl mx-auto px-6 py-16"
    >
      <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 border-l-2 border-pink-500 pl-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </motion.section>
  );
}

/* CARD */
function Card({
  children,
  hover,
  center,
}: {
  children: React.ReactNode;
  hover?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={`
        p-4 rounded-xl bg-white/5 border border-white/10 text-sm
        transition-all duration-300
        ${hover ? "hover:scale-[1.02] hover:bg-white/10" : ""}
        ${center ? "text-center" : ""}
      `}
    >
      {children}
    </div>
  );
}
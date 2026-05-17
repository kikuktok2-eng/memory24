"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPage() {
  const router = useRouter();

  const [images, setImages] = useState([
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
  ]);

  const update = (i: number, value: string) => {
    const copy = [...images];
    copy[i] = value;
    setImages(copy);
  };

  return (
    <main className="min-h-screen bg-[#070A12] text-white p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg">Edit Photos</h1>

        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 bg-pink-500 rounded text-xs"
        >
          Back
        </button>
      </div>

      {/* EDIT LIST */}
      <div className="grid gap-4">
        {images.map((img, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">

            <img src={img} className="rounded-lg mb-2" />

            <input
              value={img}
              onChange={(e) => update(i, e.target.value)}
              className="w-full p-2 text-xs bg-black/40 border border-white/10 rounded"
            />

          </div>
        ))}
      </div>

    </main>
  );
}
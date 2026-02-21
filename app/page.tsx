"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootSplash() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleStart = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/demowelcome");
    }, 420);
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white transition-opacity duration-500 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <div
          className={`transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <Image
            src="/f3-capital-logo.png"
            alt="F3 Capital logo"
            width={220}
            height={220}
            priority
            className="mx-auto h-44 w-44 rounded-full border border-white/20 shadow-2xl sm:h-56 sm:w-56"
          />
          <h1 className="mt-8 text-3xl font-bold tracking-wide sm:text-4xl">
            F3 Service Engine
          </h1>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Fitness. Fellowship. Faith.
          </p>

          <button
            type="button"
            onClick={handleStart}
            className="mt-10 rounded-xl bg-white px-8 py-3 text-base font-semibold text-black transition hover:bg-white/90"
          >
            Start
          </button>
        </div>
      </div>
    </main>
  );
}
